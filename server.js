require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const morgan = require('morgan')
const rateLimiter = require('express-rate-limit')
const connectToDb = require('./database/connectToDb')
const auth = require('./middleware/auth')

// import routers
const userRouter = require('./routers/userRouter')
const activityRouter = require('./routers/activityRouter')
const companyRouter = require('./routers/companyRouter')
const authRouter = require('./routers/authRouter')

// import errorhandlers
const errorHandler = require('./errorHandlers/errorHandler')
const notFoundHandler = require('./errorHandlers/notFoundHandler')

// create app & port
const app = express()
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(morgan('dev'))
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100
}))

// use routers
app.use('/api/v1/companies', companyRouter)
app.use('/api/v1/users', auth, userRouter)
app.use('/api/v1/activities', auth, activityRouter)
app.use('/api/v1/auth', authRouter)

// use errorhandlers
app.use(notFoundHandler)
app.use(errorHandler)

// connect to db
const start = async () => {
    try {
      await connectToDb(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (e) {
        console.log("Connection error.")
        console.log(e.message)
    }
}

start()