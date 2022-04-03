require('dotenv').config()
const Company = require('../models/Company')
const connectToDb = require('./connectToDb')
const asyncHandler = require('../errorHandlers/asyncHandler')
const companies = require('../seedData/companies.json')
const users = require('../seedData/users.json')
const User = require('../models/User')

const populateDb = asyncHandler(async () => {
    await connectToDb(process.env.MONGO_URI)
    await Company.create(companies)
    await User.create(users)
})

module.exports = populateDb