const router = require('express').Router()
const {Company} = require('../db/models')
module.exports = router

//mounted on /api/companies

router.get('/sorted/:criteria', async (req, res, next) => {
  const criteria = req.params.criteria
  try {
    const companies = await Company.findAll({order: [criteria]})
    const filteredCompanies = companies.filter(el => el[criteria])
    res.json(filteredCompanies)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  const id = req.params.id
  console.log(id)
  try {
    const company = await Company.findByPk(id)
    res.json(company)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const companies = await Company.findAll({})
    res.json(companies)
  } catch (err) {
    next(err)
  }
})
