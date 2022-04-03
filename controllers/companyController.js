const Company = require('../models/Company')
const asyncHandler = require('../errorHandlers/asyncHandler')
const CustomError = require('../errorHandlers/customError')
const { StatusCodes } = require('http-status-codes')

exports.getCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const company = await Company.findById(companyId).populate('employees activities')
    
    if (!company) {
        throw new CustomError('No company with this id exists.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                company
            },
            users: company.employees,
            activities: company.activities,
        })
    }
})

exports.getCompanies = asyncHandler(async (req, res) => {
    let { sortBy, direction } = req.query
    direction = direction !== 'desc' ? '-': ''
    if (sortBy !== 'distance' && sortBy !== 'duration') {
        sortBy = 'points'
    }
    sortBy = `${direction}${sortBy}`
    const companies = await Company.find({}).sort(sortBy)
    if (!companies) {
        throw new CustomError('No companies found.', StatusCodes.BAD_REQUEST)
    } else {
        res.status(StatusCodes.OK).json({
            data: {
                companies
            }
        })
    }
    
})