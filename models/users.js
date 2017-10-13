//"use strict";

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

  User.findOneById = function(userId) {
    //User.hasMany(models.Task);
    //console.log("ID find");

    return User.findOne({
      where: {
        userId: userId
      }
    });
  };

  return User;
};
