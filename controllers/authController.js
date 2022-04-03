const { StatusCodes } = require("http-status-codes")
const asyncHandler = require("../errorHandlers/asyncHandler")
const CustomError = require('../errorHandlers/customError')
const User = require("../models/User")
const companies = ['Google', 'Lidl', 'BMW', 'Apple', 'Nestle']

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    if (!email || !password) {
        throw new CustomError('Please provide an email and password.', StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ email })
    
    if (!user) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    }
    
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
    } else {
        const token = user.getJWT()
        res.status(StatusCodes.OK).json({
            data: {
                token,
                user,
            }
        })
    }
})

exports.signup = asyncHandler(async (req, res) => {
    const { password, confirmPassword, email, name, company } = req.body
    
    
    if (!company || !companies.includes(company)) {
        throw new CustomError('You must signup with one of the participating companies.', StatusCodes.BAD_REQUEST)
    } 
    
    if (password !== confirmPassword) {
        throw new CustomError('Passwords should match.', StatusCodes.BAD_REQUEST)
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        throw new CustomError('Email address is already in use.', StatusCodes.BAD_REQUEST)
    } else {
        const user = await User.create({
            name,
            password,
            email,
            company,
        })
        const token = user.getJWT()
        res.status(StatusCodes.CREATED).json({
            data: {
                user,
                token
            }
        })
    }
})