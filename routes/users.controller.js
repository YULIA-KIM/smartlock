const model = require('../models/model');
const User = require('../models/users')();
const crypto=require('crypto');

exports.signUp=(req, res)=>{
  const {userId, userPw, name, phoneNumber, email} = req.body;
  let newUser = null;

  // create a new user if does not exist
  const create=(user) => {
    //console.log(user.dataValues);

    if (user) {
      throw new Error('user exists');
    } else {
      const encryptedUserPw = crypto.createHash('sha256')
                      .update(userPw)
                      .digest('base64');

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

exports.login = function(req, res){

};
