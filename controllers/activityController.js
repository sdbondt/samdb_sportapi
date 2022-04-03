const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../errorHandlers/asyncHandler");
const Activity = require("../models/Activity");
const calculatePoints = require("../utils/calculatePoints");
const validateActivityInput = require("../utils/validateInput");
const CustomError = require('../errorHandlers/customError')

exports.createActivity = asyncHandler(async (req, res) => {
    const body = validateActivityInput(req.body)
    const points = calculatePoints(body)
    body.user = req.user._id
    body.company = req.user.company
    body.points = points
    const activity = await Activity.create(body)
    res.status(StatusCodes.CREATED).json({
        data: {
            activity
        }
    })
})

exports.getActivity  = asyncHandler(async (req, res) => {
    const { activityId } = req.params
    const activity = await Activity.findById(activityId)
    if (!activity) {
        throw new CustomError('No activity found with this id.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                activity
            }
        })
    }    
})

exports.getActivities = asyncHandler(async (req, res) => {
    let { page, limit, type, company } = req.query
    const queryObj = {}

    if (type) {
        queryObj.type = { $regex: type, $options: 'i'}
    }

    if (company) {
        queryObj.company = { $regex: company, $options: 'i' }
    }

    page = page || 1
    limit = limit || 10
    const skip = (page - 1) * limit
    
    const activities = await Activity.find(queryObj).skip(skip).limit(limit)
    if (!activities) {
        throw new CustomError('No activities found for you or your company.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                activities
            }
        })
    }
})

exports.deleteActivity = asyncHandler(async (req, res) => {
    const { activityId } = req.params
    const activity = await Activity.findOne({
        _id: activityId,
        user: req.user._id
    })

    if (!activity) {
        throw new CustomError('Cannot delete this id.', StatusCodes.BAD_REQUEST)
    } else {
        await activity.remove()
        res.status(StatusCodes.OK).json({
            data: {
                msg: 'Activity got deleted.'
            }
        })
    }

})