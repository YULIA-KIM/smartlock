'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var model = require('../models/model');
var User = require('../models/users')();
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var mail = require('../library/mail');

var machineid = require('../config/machineid');
var EXPIRES = 3 * 60 * 60;

exports.login = function (req, res) {
    // console.log('login api is working');
    var _req$body = req.body,
        userId = _req$body.userId,
        userPw = _req$body.userPw;

    var encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

    // check the user info & generate the jwt
    var check = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
            var token;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (user) {
                                _context.next = 4;
                                break;
                            }

                            throw new Error('login failed');

                        case 4:
                            if (!(user.userPw == encryptedUserPw)) {
                                _context.next = 15;
                                break;
                            }

                            _context.t0 = jwt;
                            _context.t1 = {
                                userId: user.userId,
                                userPw: user.userPw,
                                name: user.name,
                                phoneNumber: user.phoneNumber,
                                email: user.email
                            };
                            _context.next = 9;
                            return machineid();

                        case 9:
                            _context.t2 = _context.sent;
                            _context.t3 = {
                                expiresIn: EXPIRES,
                                issuer: 'www.smartlock.com',
                                subject: 'userInfo'
                            };
                            token = _context.t0.sign.call(_context.t0, _context.t1, _context.t2, _context.t3);
                            return _context.abrupt('return', token);

                        case 15:
                            throw new Error('login failed');

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function check(_x) {
            return _ref.apply(this, arguments);
        };
    }();

    // respond the token 
    var respond = function respond(token) {
        res.status(200).json({
            message: 'logged in successfully',
            token: token
        });
    };

    // error occured
    var onError = function onError(error) {
        res.status(403).json({
            message: error.message
        });
    };

    // find the user
    User.findOneById(userId).then(check).then(respond).catch(onError);
};

exports.signUp = function (req, res) {
    console.log(req);
    var _req$body2 = req.body,
        userId = _req$body2.userId,
        userPw = _req$body2.userPw,
        name = _req$body2.name,
        phoneNumber = _req$body2.phoneNumber,
        email = _req$body2.email;

    var newUser = null;

    // create a new user if does not exist
    var create = function create(user) {
        //console.log(user.dataValues);

        //   console.log(user);

        if (user) {
            throw new Error('user exists');
        } else {
            var encryptedUserPw = crypto.createHash('sha256').update(userPw).digest('base64');

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

    var sendSignUpMail = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(user) {
            var secret, token;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return machineid();

                        case 2:
                            secret = _context2.sent;
                            token = jwt.sign({
                                userId: user.dataValues.userId
                            }, secret, {
                                expiresIn: '1d',
                                issuer: 'www.smartlock.com',
                                subject: 'EmailVerify'
                            });
                            return _context2.abrupt('return', mail({
                                to: 'tpnet3@gmail.com', // list of receivers
                                subject: '스마트락 회원가입 확인 메일', // Subject line
                                text: '스마트락 회원가입 확인 메일입니다.\n' // plain text body
                                + '\n' + '회원가입을 완료하기 위해 다음 링크로 접속하세요.\n' + 'http://localhost:3000/#!/email_verify?code=' + token
                                //html: '<b>Hello world?</b>' // html body
                            }).then(function () {
                                return user;
                            }));

                        case 5:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function sendSignUpMail(_x2) {
            return _ref2.apply(this, arguments);
        };
    }();

    //respond to the client
    var respond = function respond(user) {
        console.log(user);

        res.json({
            message: 'registered successfully',
            admin: user ? true : false
        });
    };

    //run when there is an error (username exists)
    var onError = function onError(error) {

        console.error(error);

        res.status(409).json({
            message: error.message
        });
    };

    //check username duplication

    User.findOneById(userId).then(create).then(sendSignUpMail).then(respond).catch(onError);
};

exports.emailVerify = function (req, res) {

    var checkCode = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var secret;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return machineid();

                        case 2:
                            secret = _context3.sent;
                            return _context3.abrupt('return', jwt.verify(req.query.code, secret));

                        case 4:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function checkCode() {
            return _ref3.apply(this, arguments);
        };
    }();

    var updateUser = function updateUser(decodedJwt) {
        return User.update({
            email_verify: 1
        }, {
            where: {
                userId: decodedJwt.userId
            }
        });
    };

    var respond = function respond() {
        res.json({
            success: 1
        });
    };

    var onError = function onError(error) {
        console.error(error);

        res.status(409).json({
            message: error.message
        });
    };

    new Promise(function (resolve, reject) {
        return resolve();
    }).then(checkCode).then(updateUser).then(respond).catch(onError);
};