const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') // 使用中文
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTime: a => dayjs(a).fromNow(),
  messageTime: a => {
    // 訊息小時
    const MessageHour = Number(dayjs(a).format('H'))

    if (MessageHour > 12 && MessageHour < 24) {
      return dayjs(a).format('下午h:mm')
    } else {
      return dayjs(a).format('上午h:mm')
    }
  },
  messageListTime: a => {
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const nowTimeStamp = new Date().getTime()
    const diffValue = nowTimeStamp - new Date(a).getTime()

    //  計算時間差
    const diffDay = diffValue / day
    const diffWeek = diffValue / week

    //  比較年份
    const nowYear = Number(dayjs(new Date()).format('YYYY'))
    const Messageyear = Number(dayjs(a).format('YYYY'))

    //  比較日期
    const nowDay = Number(dayjs(new Date()).format('D'))
    const MessageDay = Number(dayjs(a).format('D'))

    // 訊息小時
    const MessageHour = Number(dayjs(a).format('H'))

    if (Messageyear !== nowYear) {
      return dayjs(a).format('YYYY/M/D')
    } else if (diffWeek > 1) {
      return dayjs(a).format('M/D')
    } else if (diffDay >= 2 && diffDay < 7) {
      return dayjs(a).format('dddd')
    } else if (MessageDay !== nowDay) {
      return '昨天'
    } else if (MessageHour > 12 && MessageHour < 24) {
      return dayjs(a).format('下午h:mm')
    } else {
      return dayjs(a).format('上午h:mm')
    }
  }
}
