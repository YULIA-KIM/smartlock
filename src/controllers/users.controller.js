const model = require('../models/model');
const User = require('../models/users')();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mail = require('../library/mail');

const machineid = require('../config/machineid');
const EXPIRES = 3 * 60 * 60;

exports.login = (req, res) => {
    // console.log('login api is working');
    const {userId, userPw} = req.body;
    const encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

    // check the user info & generate the jwt
    const check = async (user) => {
        // console.log("Id and Pw is checked");
        if(!user) {
            // user does not exist
            throw new Error('login failed');
        } else {
            // user exists, check the password
            if(user.userPw == encryptedUserPw) {
                // console.log("Pw is corrected");
                // create a promise that generates jwt asynchronously
                const token = jwt.sign(
                    {
                        userId: user.userId,
                        userPw: user.userPw,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        email: user.email
                    },
                    await machineid(),
                    {
                        expiresIn: EXPIRES,
                        issuer: 'www.smartlock.com',
                        subject: 'userInfo'
                    });
                    // console.log(token);
                return token;
            } else {
                throw new Error('login failed');
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.status(200).json({
            message: 'logged in successfully',
            token
        })
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        })
    }

    // find the user
    User.findOneById(userId)
    .then(check)
    .then(respond)
    .catch(onError)

};

exports.signUp=(req, res)=>{
    console.log(req);
    const {userId, userPw, name, phoneNumber, email} = req.body;
    let newUser = null;

    // create a new user if does not exist
    const create=(user) => {
      //console.log(user.dataValues);

    //   console.log(user);
  
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
        // return User.createUserInfo(userId, encryptedUserPw, name, phoneNumber, email).then(() => {
        //   return false;
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
            + 'http://localhost:3000/#!/email_verify?code=' + token
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

exports.emailVerify = (req, res) => {

  const checkCode = async () => {
    const secret = await machineid();
    return jwt.verify(req.query.code, secret);
  }

  const updateUser = (decodedJwt) => {
    return User.update({
      email_verify: 1
    }, {
      where: {
        userId: decodedJwt.userId
      }
    });
  }

  const respond = () => {
    res.json({
      success: 1
    });
  }

  const onError = (error) => {
    console.error(error);

    res.status(409).json({
      message: error.message
    });
  }

  new Promise((resolve, reject) => resolve())
      .then(checkCode)
      .then(updateUser)
      .then(respond)
      .catch(onError)
}
