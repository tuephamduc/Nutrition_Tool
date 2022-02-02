"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloServerExpress = require("apollo-server-express");

var _graphql = require("graphql");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AuthDirective =
/*#__PURE__*/
function (_SchemaDirectiveVisit) {
  _inherits(AuthDirective, _SchemaDirectiveVisit);

  function AuthDirective() {
    _classCallCheck(this, AuthDirective);

    return _possibleConstructorReturn(this, _getPrototypeOf(AuthDirective).apply(this, arguments));
  }

  _createClass(AuthDirective, [{
    key: "visitFieldDefinition",
    value: function visitFieldDefinition(field) {
      var requiredRole = this.args.requires;
      var originalResolve = field.resolve || _graphql.defaultFieldResolver;

      field.resolve = function _callee() {
        var _len,
            args,
            _key,
            context,
            user,
            userRoles,
            isUnauthorized,
            _args = arguments;

        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args[_key];
                }

                context = args[2];
                user = context.user || {};
                userRoles = user.roles; // const isUnauthorized = !userRoles.includes(requiredRole);

                isUnauthorized = !(userRoles == requiredRole); // console.log(userRoles);
                // console.log("requre", requiredRole);

                if (!isUnauthorized) {
                  _context.next = 7;
                  break;
                }

                throw new _apolloServerExpress.AuthenticationError("You need following role: ".concat(requiredRole));

              case 7:
                return _context.abrupt("return", originalResolve.apply(this, args));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, null, this);
      };
    }
  }]);

  return AuthDirective;
}(_apolloServerExpress.SchemaDirectiveVisitor);

var _default = AuthDirective;
exports["default"] = _default;