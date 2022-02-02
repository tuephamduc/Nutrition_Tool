"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _index = _interopRequireWildcard(require("../models/index"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jwtHelper = require("../helpers/jwtHelper");

var _mailservice = require("../services/mailservice");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var authResolvers = {
  Query: {
    users: function users() {
      return regeneratorRuntime.async(function users$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_index.User.findAll());

            case 2:
              return _context.abrupt("return", _context.sent);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    user: function user(parent, _ref) {
      var id;
      return regeneratorRuntime.async(function user$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              id = _ref.id;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  id: id
                }
              }));

            case 3:
              return _context2.abrupt("return", _context2.sent);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    },
    currentUser: function currentUser(parent, args, _ref2) {
      var user;
      return regeneratorRuntime.async(function currentUser$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              user = _ref2.user;
              return _context3.abrupt("return", user);

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  },
  Mutation: {
    signupUser: function signupUser(parent, args) {
      var username, email, password, roles, existUser, hashPassword, unconfirmUser, user, data, token, URL, subject, text, _user, _data, _token, _URL, _subject, _text;

      return regeneratorRuntime.async(function signupUser$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              username = args.username, email = args.email, password = args.password, roles = args.roles;
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  email: email,
                  active: true
                }
              }));

            case 4:
              existUser = _context4.sent;

              if (!existUser) {
                _context4.next = 7;
                break;
              }

              throw new Error('Email already used !!!');

            case 7:
              _context4.next = 9;
              return regeneratorRuntime.awrap(_bcrypt["default"].hash(password, 12));

            case 9:
              hashPassword = _context4.sent;
              _context4.next = 12;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  email: email,
                  active: false
                }
              }));

            case 12:
              unconfirmUser = _context4.sent;

              if (!unconfirmUser) {
                _context4.next = 29;
                break;
              }

              _context4.next = 16;
              return regeneratorRuntime.awrap(_index.User.update({
                username: username,
                password: password
              }, {
                where: {
                  email: email
                }
              }));

            case 16:
              _context4.next = 18;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  email: email
                }
              }));

            case 18:
              user = _context4.sent;
              //GENERATE CONFIRMATION URL
              data = {
                user: _lodash["default"].pick(user, ['id'])
              };
              token = (0, _jwtHelper.generateToken)(data, "1d");
              URL = "http://localhost:3000/user/confirmation/".concat(token); //SEND CONFIRMATION MAIL

              subject = "Confirmation register of ".concat(username);
              text = "Hi ".concat(username, ", click here to active you account:\n        <a href=\"").concat(URL, "\">").concat(URL, "</a>");
              _context4.next = 26;
              return regeneratorRuntime.awrap(_mailservice.transporter.sendMail((0, _mailservice.mailOption)(email, subject, text)).then(function () {
                return console.log("Check your email");
              }));

            case 26:
              return _context4.abrupt("return", user);

            case 29:
              _context4.next = 31;
              return regeneratorRuntime.awrap(_index.User.create({
                username: username,
                email: email,
                password: hashPassword,
                active: false,
                roles: roles
              }));

            case 31:
              _user = _context4.sent;
              //GENERATE CONFIRMATION URL
              _data = {
                user: _lodash["default"].pick(_user, ['id'])
              };
              _token = (0, _jwtHelper.generateToken)(_data, "1d");
              _URL = "http://localhost:3000/user/confirmation/".concat(_token); //SEND CONFIRMATION MAIL

              _subject = "Confirmation register of ".concat(username);
              _text = "Hi ".concat(username, ", click here to active you account:\n        <a href=\"").concat(_URL, "\">").concat(_URL, "</a>");
              _context4.next = 39;
              return regeneratorRuntime.awrap(_mailservice.transporter.sendMail((0, _mailservice.mailOption)(email, _subject, _text)).then(function () {
                return console.log("Check your email");
              }));

            case 39:
              return _context4.abrupt("return", _user);

            case 40:
              _context4.next = 45;
              break;

            case 42:
              _context4.prev = 42;
              _context4.t0 = _context4["catch"](1);
              throw _context4.t0;

            case 45:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[1, 42]]);
    },
    activeEmail: function activeEmail(parent, _ref3) {
      var token, _decodeToken, user;

      return regeneratorRuntime.async(function activeEmail$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              token = _ref3.token;
              _decodeToken = (0, _jwtHelper.decodeToken)(token), user = _decodeToken.user;

              if (user) {
                _context5.next = 5;
                break;
              }

              throw Error("Confirmation is expire. Please try again");

            case 5:
              _context5.next = 7;
              return regeneratorRuntime.awrap(_index.User.update({
                active: true
              }, {
                where: {
                  id: user.id
                }
              }));

            case 7:
              return _context5.abrupt("return", true);

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      });
    },
    login: function login(parent, args) {
      var email, password, roles, user, valid, data, token;
      return regeneratorRuntime.async(function login$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              email = args.email, password = args.password, roles = args.roles;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  email: email,
                  active: true,
                  roles: roles
                }
              }));

            case 3:
              user = _context6.sent;

              if (user) {
                _context6.next = 6;
                break;
              }

              throw new Error("Incorrected email !!!");

            case 6:
              _context6.next = 8;
              return regeneratorRuntime.awrap(_bcrypt["default"].compare(password, user.password));

            case 8:
              valid = _context6.sent;

              if (valid) {
                _context6.next = 11;
                break;
              }

              throw new Error("Password is not correct");

            case 11:
              data = {
                user: _lodash["default"].pick(user, ['id', 'username', 'roles'])
              };
              token = (0, _jwtHelper.generateToken)(data, "1d");
              return _context6.abrupt("return", {
                user: user,
                token: token
              });

            case 14:
            case "end":
              return _context6.stop();
          }
        }
      });
    },
    sendMailForgotPassword: function sendMailForgotPassword(parent, _ref4) {
      var email, user, data, token, URL, subject, text;
      return regeneratorRuntime.async(function sendMailForgotPassword$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              email = _ref4.email;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_index.User.findOne({
                where: {
                  email: email,
                  active: true
                }
              }));

            case 3:
              user = _context7.sent;

              if (user) {
                _context7.next = 9;
                break;
              }

              throw Error("Unregister or unactive Email");

            case 9:
              //GENERATE CONFIRMATION URL
              data = {
                user: _lodash["default"].pick(user, ['id', 'email'])
              };
              token = (0, _jwtHelper.generateToken)(data, "1d");
              URL = "http://localhost:3000/user/reset-password/".concat(token); //SEND CONFIRMATION MAIL

              subject = "Reset Password of ".concat(email);
              text = "Hi ".concat(user.username, ", click here to reset password:\n              <a href=\"").concat(URL, "\">").concat(URL, "</a>");
              _context7.next = 16;
              return regeneratorRuntime.awrap(_mailservice.transporter.sendMail((0, _mailservice.mailOption)(email, subject, text)).then(function () {
                return console.log("Check your email");
              }));

            case 16:
              return _context7.abrupt("return", true);

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      });
    },
    forgotPassword: function forgotPassword(parent, _ref5) {
      var token, newPassword, _decodeToken2, user, hashPassword;

      return regeneratorRuntime.async(function forgotPassword$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              token = _ref5.token, newPassword = _ref5.newPassword;
              _decodeToken2 = (0, _jwtHelper.decodeToken)(token), user = _decodeToken2.user;
              _context8.next = 4;
              return regeneratorRuntime.awrap(_bcrypt["default"].hash(newPassword, 12));

            case 4:
              hashPassword = _context8.sent;

              if (user) {
                _context8.next = 10;
                break;
              }

              throw Error("Confirmation is expire. Please try again");

            case 10:
              _context8.next = 12;
              return regeneratorRuntime.awrap(_index.User.update({
                password: hashPassword
              }, {
                where: {
                  id: user.id
                }
              }));

            case 12:
              return _context8.abrupt("return", true);

            case 13:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }
};
var _default = authResolvers;
exports["default"] = _default;