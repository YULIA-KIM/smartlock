const model = require('../models/model');
const User = require('../models/users')();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mail = require('../library/mail');

const machineid = require('../config/machineid');
const EXPIRES = 3 * 60 * 60;

exports.login = function (req, res) {
    // console.log('login api is working');
    let userId = req.body.id;
    let userPw = req.body.password;
    let encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

    // console.log('hashed: ' , encryptedUserPw);

    const verifyUser = async function (userId, encryptedUserPw) {
        // console.log("Id and Pw is checked");
        const secret = await machineid();

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
                    secret,
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

exports.signUp = (req, res) => {
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
          email: email,
          email_verify: 0
        });
      }
    };

    const sendSignUpMail = async (user) => {
      const secret = await machineid();

      const token = jwt.sign(
          {
              userId: user.dataValues.userId
          },
          secret,
          {
              expiresIn: '1d',
              issuer: 'www.smartlock.com',
              subject: 'EmailVerify'
          });

      return mail({
          to: 'tpnet3@gmail.com', // list of receivers
          subject: '스마트락 회원가입 확인 메일', // Subject line
          text: '스마트락 회원가입 확인 메일입니다.\n' // plain text body
            + '\n'
            + '회원가입을 완료하기 위해 다음 링크로 접속하세요.\n'
            + 'http://localhost:3000/users/email_verify?code=' + token
          //html: '<b>Hello world?</b>' // html body
      }).then(() => {
        return user;
      });
    };

    //respond to the client
    const respond = (user) => {
      console.log(user);

      res.json({
        message: 'registered successfully',
        admin: user ? true:false
      });
    };

    //run when there is an error (username exists)
    const onError=(error)=>{

      console.error(error);

      res.status(409).json({
        message: error.message
      });
    };

    //check username duplication

    User.findOneById(userId)
      .then(create)
      .then(sendSignUpMail)
      .then(respond)
      .catch(onError);
  };
