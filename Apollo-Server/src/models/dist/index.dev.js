"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Product = exports.UserProfile = exports.User = exports.sequelize = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_dotenv["default"].config();

var dbUser = process.env.DB_USER;
var dbPassword = process.env.DB_PASSWORD;
var dbHost = process.env.DB_HOST;
var dbName = process.env.DB_NAME;
var dbPort = process.env.DB_PORT;
var sequelize = new _sequelize["default"](dbName, dbUser, dbPassword, {
  dialect: "postgres",
  host: dbHost,
  port: dbPort,
  define: {
    freezeTableName: true
  }
});
exports.sequelize = sequelize;
var User = sequelize.define('user', {
  username: {
    type: _sequelize["default"].STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: _sequelize["default"].STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: _sequelize["default"].STRING,
    allowNull: false // validate: {
    //   notEmpty: true,
    // },

  },
  active: {
    type: _sequelize["default"].BOOLEAN,
    defaultValue: false
  },
  roles: {
    type: _sequelize["default"].STRING
  }
});
exports.User = User;
var UserProfile = sequelize.define('user-profile', {
  userId: {
    type: _sequelize["default"].INTEGER,
    references: {
      model: 'user',
      // 'fathers' refers to table name
      key: 'id' // 'id' refers to column name in fathers table

    }
  },
  gender: {
    type: _sequelize["default"].INTEGER
  },
  birthday: {
    type: _sequelize["default"].DATE
  },
  avatar: {
    type: _sequelize["default"].STRING
  }
});
exports.UserProfile = UserProfile;
var Product = sequelize.define('product', {
  userId: {
    type: _sequelize["default"].INTEGER,
    references: {
      model: 'user',
      // 'fathers' refers to table name
      key: 'id' // 'id' refers to column name in fathers table

    }
  },
  productName: {
    type: _sequelize["default"].STRING
  }
});
exports.Product = Product;
User.hasOne(UserProfile);
User.hasMany(Product); // sequelize.sync().then(() => console.log("Khoi tao bang user")).catch(err => console.log(err.message))

var _default = sequelize;
exports["default"] = _default;