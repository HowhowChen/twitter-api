const { Tweet, User, Reply, Like, Subscribe, NewTweetNotice, LikeNotice, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        createdAt: relativeTime(tweet.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(req.params.id, {
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const data = tweet.toJSON()
      data.createdAt = relativeTime(data.createdAt)
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { name } = helpers.getUser(req)
      const description = req.body.description.trim()
      if (!description) {
        return res.status(422).json({
          status: 'error',
          message: '推文不可空白！'
        })
      }
      if (description.length > 140) {
        return res.status(422).json({
          status: 'error',
          message: '字數超出上限！'
        })
      }

      //  新增推文與找自己的粉絲
      const [tweet, subscribers] = await Promise.all([
        Tweet.create({
          UserId,
          description
        }),
        Subscribe.findAll({
          attributes: ['id'],
          where: { subscribingId: UserId },
          raw: true,
          nest: true
        })
      ])

      //  如果有粉絲
      if (subscribers.length !== 0) {
        const TweetId = tweet.toJSON().id
        await Promise.all(subscribers.map(subscriber => {
          return NewTweetNotice.create({
            SubscribeId: subscriber.id,
            TweetId,
            url: `${process.env.BASE_URL}/api/tweets/${TweetId}`,
            title: `${name}有新的推文通知`,
            isRead: false
          })
        }))
      }

      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        where: { TweetId }
      })
      const data = replies.map(reply => ({
        ...reply,
        createdAt: relativeTime(reply.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweetReply: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const comment = req.body.comment.trim()
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      if (!comment) {
        return res.status(422).json({
          status: 'error',
          message: '回覆不可空白！'
        })
      }
      await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const { name } = helpers.getUser(req)
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const like = await Like.findOrCreate({
        where: { UserId, TweetId }
      })

      if (!like[1]) {
        return res.status(422).json({
          status: 'error',
          message: '已表示喜歡'
        })
      }

      //  建立喜歡貼文通知
      await LikeNotice.create({
        UserId: tweet.toJSON().UserId, //  推文作者
        TweetId,
        url: `${process.env.BASE_URL}/api/tweets/${TweetId}`,
        title: `${name}喜歡你的貼文`,
        isRead: false
      })

      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在！'
        })
      }
      const like = await Like.destroy({ where: { UserId, TweetId } })
      if (!like) {
        return res.status(404).json({
          status: 'error',
          message: '未表示喜歡'
        })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
