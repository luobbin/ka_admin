'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://robin.la/api/admin"',
  BASE_API_OTHER: '"http://robin.la/api/admin"',
  BASE_API_TRADE: '"http://robin.la/api/admin"',
  // BASE_API: '"http://member.aikbao.net/admin/v1"',
  // BASE_API_OTHER: '"http://other.aikbao.net/admin/v1"',
  // BASE_API_TRADE: '"http://order.aikbao.net/admin/v1"',

})
