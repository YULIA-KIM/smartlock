"use strict";

const Sequelize = require('sequelize');
const sequelize = require('./model');

module.exports = function() {
  var User = sequelize.define("users", {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    userPw: Sequelize.STRING,
    name: Sequelize.STRING,
    phoneNumber: Sequelize.STRING,
    email: Sequelize.STRING
  }, {
      timestamps: false
  });

  User.associate = function(models) {
    //User.hasMany(models.Task);
    console.log("Hello World");

    User.findOne({ where: {} }).then(project => {
      console.log(project);
      // project will be the first entry of the Projects table with the title 'aProject' || null
    })
  };

  return User;
};
