const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errorHandlers/customError')
const allTypes = ['cycling', 'running', 'swimming', 'walking', 'fitness', 'tennis', 'padel', 'basketball', 'football', 'aerobics', 'yoga', 'other']
const distanceTypes = ['cycling', 'running', 'swimming', 'walking']
const durationTypes = ['fitness', 'tennis', 'padel', 'basketball', 'football', 'aerobics', 'yoga', 'other']

const validateActivityInput = (body) => {
    const { type, duration, distance } = body

    if (!type ) {
        throw new CustomError('You must define what type of activity you did.', StatusCodes.BAD_REQUEST)
    }

    if (!allTypes.includes(type)) {
        throw new CustomError('You can\'t add that type of activity, use "other" for you activity.', StatusCodes.BAD_REQUEST)
    }

    if (distanceTypes.includes(type) && !distance) {
        throw new CustomError('You must specify your distance for this activity', StatusCodes.BAD_REQUEST)
    }

    if (durationTypes.includes(type) && !duration) {
        throw new CustomError('You must specify the duration for this activity.', StatusCodes.BAD_REQUEST)
    }

    if (durationTypes.includes(type) && duration) {
        return {
            type,
            duration: Number(duration)
        }
    }

    if (distanceTypes.includes(type) && distance) {
        return {
            type,
            distance: Number(distance)
        }
    }
}

module.exports = validateActivityInput