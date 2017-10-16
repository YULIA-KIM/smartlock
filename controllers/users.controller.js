const model = require('../models/model');
const User = require('../models/users')();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const SECRET = require('../config/security');
const EXPIRES = 3 * 60 * 60;

exports.login = function (req, res) {
    // console.log('login api is working');
    let userId = req.body.id;
    let userPw = req.body.password;
    let encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

    // console.log('hashed: ' , encryptedUserPw);

    const verifyUser = function (userId, encryptedUserPw) {
        // console.log("Id and Pw is checked");
        User.searchingForIdPw(userId, encryptedUserPw).then(function (result) {
            if (result) {
                const token = jwt.sign(
                    {
                        userId: result.userId,
                        userPw: result.userPw,
                        name: result.name,
                        phoneNumber: result.phoneNumber,
                        email: result.email
                    },
                    SECRET,
                    {
                        expiresIn: EXPIRES,
                        issuer: 'www.smartlock.com',
                        subject: 'userInfo'
                    });
                // console.log(token);
                res.status(200).json({ isOK: true, token: token });
            }
            else {
                console.log("Not found id");
                res.status(400).json({ isOK: false });
            };
        }).catch(function (err) {
            res.status(404).json({ error: 'Not found' });
        });
    };
    verifyUser(userId, encryptedUserPw);
};


exports.signUp=(req, res)=>{
    const {userId, userPw, name, phoneNumber, email} = req.body;
    let newUser = null;

    // create a new user if does not exist
    const create=(user) => {
      //console.log(user.dataValues);

      if (user) {
        throw new Error('user exists');
      } else {
        const encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

        return User.create({
          userId: userId,
          userPw: encryptedUserPw,
          name: name,
          phoneNumber: phoneNumber,
          email: email
        }).then(() => {
          return false;
        });
      }
    };
    //respond to the client
    const respond=(isAdmin)=>{
      res.json({
        message: 'registered successfully',
        admin: isAdmin ? true:false
      });
    };

    //run when there is an error (username exists)
    const onError=(error)=>{

      //console.log(error);

      res.status(409).json({
        message: error.message
      });
    };

    //check username duplication
    User.findOneById(userId)
      .then(create)
      .then(respond)
      .catch(onError);
  };
