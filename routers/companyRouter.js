const express = require('express')
const { getCompany, getCompanies } = require('../controllers/companyController')
const router = express.Router()

router.get('/:companyId', getCompany)
router.get('/', getCompanies)

module.exports = router