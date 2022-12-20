const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') // 使用中文
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  relativeTime: a => dayjs(a).fromNow(),
  messageTime: a => {
    const hour = Number(dayjs(a).format('H'))
    if (hour > 12 && hour < 24) {
      return dayjs(a).format('下午h:mm')
    } else {
      return dayjs(a).format('上午h:mm')
    }
  }
}
