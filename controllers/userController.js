const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("../errorHandlers/asyncHandler");
const User = require("../models/User");
const CustomError = require('../errorHandlers/customError.js')

exports.getProfile = asyncHandler(async (req, res) => {
    await req.user.populate('activities')
    res.status(StatusCodes.OK).json({
        data: {
            user: req.user,
            activities: req.user.activities,
        }
    })
})

exports.getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const user = await User.findById(userId).populate('activities')
    if (!user) {
        throw new CustomError('No user found with this id.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                user
            },
            activities: user.activities
        })
    }
})

exports.getUsers = asyncHandler(async (req, res) => {
    let { sortBy, direction, company, page, limit } = req.query
    const queryObj = {}
    
    direction = direction !== 'desc' ? '-': ''
    if (sortBy !== 'distance' && sortBy !== 'duration') {
        sortBy = 'points'
    }
    sortBy = `${direction}${sortBy}`
    
    if (company) {
        queryObj.company = { $regex: company, $options: "i" }
    }

    page = page || 1
    limit = limit || 10
    const skip = (page -1) * limit

    const users = await User.find(queryObj).sort(sortBy).skip(skip).limit(limit)
    if (!users) {
        throw new CustomError('No users found for this request.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                users
            }
        })
    }
})