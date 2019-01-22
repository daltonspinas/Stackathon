const Sequelize = require('sequelize')
const db = require('../db')

const Domain = db.define('domain', {
  name: {
    type: Sequelize.STRING
  },
  domain: {
    type: Sequelize.ARRAY(Sequelize.DECIMAL)
  }
})

module.exports = Domain
