'use strict';

var Sequelize = require('sequelize');

var sequelize = new Sequelize('board', 'test1', '1234', {
  'host': '211.253.9.163',
  'dialect': 'mysql',
  logging: false
});

module.exports = sequelize;