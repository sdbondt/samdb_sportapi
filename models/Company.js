const mongoose = require('mongoose')
const User = require('./User')
const { Schema, model } = mongoose

const CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, 'You must add a company name'],
        enum: ['Apple', 'Lidl', 'BMW', 'Google', 'Nestle'],
        unique: [true, 'Company names must be unique.']
    },
    description: {
        type: String,
        required: [true, 'You must add a description.']
    },
    site: String,
    points: {
        type: Number,
        default: 0,
        min: [0, 'Your points can\'t be lower than zero.']
    },
    duration: {
        type: Number,
        default: 0,
        min: [0, 'Duration can\'t be below zero.']
    },
    distance: {
        type: Number,
        default: 0,
        min: [0, 'Distance can\'t be below zero.']
    },
})

// niet gebruiken, komt op zelfde neer als virtual
// CompanySchema.methods.getEmployees = async function () {
//     const employees = await User.find({ company: this.name })
//     return employees
// }

CompanySchema.virtual('employees', {
    ref: 'User',
    localField: 'name',
    foreignField: 'company',
    justOne: false
})

CompanySchema.virtual('activities', {
    ref: 'Activity',
    localField: 'name',
    foreignField: 'company',
    justOne: false
})

const Company = model('Company', CompanySchema)
module.exports = Company