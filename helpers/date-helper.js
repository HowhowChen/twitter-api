const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') // 使用中文
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTime: a => dayjs(a).fromNow(),
  nowDay: () => dayjs(new Date()).format('D'),
  messageNowDay: a => dayjs(a).format('D'),
  simplifyMessageTime: a => dayjs(a).format('Ah:mm'),
  detailMessageTime: a => dayjs(a).format('M月D日 Ah:mm')
}
