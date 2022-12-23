const express = require('express')
const router = express.Router()
const subscribeController = require('../../controllers/subscribe-controller')

router.delete('/:subscribingId', subscribeController.deleteSubscribing)
router.post('/', subscribeController.addSubscribing)

module.exports = router
