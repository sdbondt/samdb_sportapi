const mongoose = require('mongoose')
const { update } = require('./User')
const { Schema, model } = mongoose

const ActivitySchema = new Schema({
    type: {
        type: String,
        enum: ['cycling', 'running', 'swimming', 'walking', 'fitness', 'tennis', 'padel', 'basketball', 'football', 'aerobics', 'yoga', 'other']
    },
    company: {
        type: String,
        required: [true, 'You must add a company name'],
        enum: ['Apple', 'Lidl', 'BMW', 'Google', 'Nestle'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'You must add a user to your activity.']
    },
    duration: {
        type: Number,
        min: [0, 'Activity duration can\'t be lower than zero.']
    },
    distance: {
        type: Number,
        min: [0, 'Activity distance can\'t be lower than zero.']
    },
    points: {
        type: Number,
        min: [0, 'Activity points can\'t be lower than zero.'],
        required: [true, 'Points must be rewarded for this activity.']
    }
})

ActivitySchema.statics.setUpdatedValues = async function (company, userId, updateValues) {
    try {
        const companyPromise = this.model('Company').findOneAndUpdate(
            { name: company },
            { $inc: { points: updateValues.points, distance: updateValues.distance, duration: updateValues.duration }}
        )
        const userPromise = this.model('User').findByIdAndUpdate(
            userId,
            { $inc: { points: updateValues.points, distance: updateValues.distance, duration: updateValues.duration }}
        )
        await Promise.all([companyPromise, userPromise])        
    } catch (e) {
        console.log(e)
    }
}

ActivitySchema.post('save', async function () {
    const updateValues = {
        points: this.points,
        distance: this.distance || 0,
        duration: this.duration || 0,
    }

    await this.constructor.setUpdatedValues(this.company, this.user, updateValues)
})

ActivitySchema.pre('remove', async function () {
    const updateValues = {
        points: -this.points,
        distance: -this.distance || 0,
        duration: -this.duration || 0,
    }

    await this.constructor.setUpdatedValues(this.company, this.user, updateValues)
})

const Activity = model('Activity', ActivitySchema)
module.exports = Activity