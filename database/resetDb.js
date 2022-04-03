require('dotenv').config()
const asyncHandler = require('../errorHandlers/asyncHandler')
const Activity = require('../models/Activity')
const Company = require('../models/Company')
const User = require('../models/User')
const connectToDb = require('./connectToDb')


connectToDb(process.env.MONGO_URI)
const resetDb = asyncHandler(async () => {
  await Company.deleteMany({})
  await User.deleteMany({})
  await Activity.deleteMany({})
  console.log('Data from database got deleted.')
})

module.exports = resetDb