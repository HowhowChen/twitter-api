const { Subscribe, User } = require('../models')
const helpers = require('../_helpers')

const subscribeController = {
  addSubscribing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const subscribingId = Number(req.body.id)

      if (subscribingId === currentUserId) {
        return res.status(422).json({
          status: 'error',
          message: '使用者不可以訂閱自己.'
        })
      }

      const [user, subscribe] = await Promise.all([
        User.findByPk(subscribingId),
        Subscribe.findOne({
          where: {
            subscriberId: currentUserId,
            subscribingId
          }
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      if (subscribe) throw new Error('你已經訂閱過了!')

      await Subscribe.create({
        subscriberId: currentUserId,
        subscribingId
      })

      res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  deleteSubscribing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const subscribingId = Number(req.params.subscribingId)

      if (subscribingId === currentUserId) {
        return res.status(422).json({
          status: 'error',
          message: '使用者不可以取消訂閱自己.'
        })
      }

      const [user, subscribe] = await Promise.all([
        User.findByPk(currentUserId),
        Subscribe.findOne({
          where: {
            subscriberId: currentUserId,
            subscribingId
          }
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在.'
        })
      }

      if (!subscribe) throw new Error('你還沒訂閱喔!')

      await subscribe.destroy()

      res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = subscribeController
