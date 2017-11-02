//"use strict";

const Sequelize = require('sequelize');
const model = require('./model');

module.exports = function () {
  const User = model.define("users", {
      userId: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      userPw: Sequelize.STRING(100),
      name: Sequelize.STRING(20),
      phoneNumber: Sequelize.STRING(20),
      email: Sequelize.STRING(50),
      email_verify: Sequelize.INTEGER
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

  User.createUserInfo = function(userId, encryptedUserPw, name, phoneNumber, email) {
    return User.create({
      userId: userId,
      userPw: encryptedUserPw,
      name: name,
      phoneNumber: phoneNumber,
      email: email
    });
  };



  return User;
};
