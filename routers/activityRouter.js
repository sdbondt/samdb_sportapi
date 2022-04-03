const express = require('express')
const { createActivity, getActivity, getActivities, deleteActivity } = require('../controllers/activityController')
const router = express.Router()

router.post('/', createActivity)
router.get('/:activityId', getActivity)
router.get('/', getActivities)
router.delete('/:activityId', deleteActivity)

module.exports = router