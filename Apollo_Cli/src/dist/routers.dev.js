"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactHelmetAsync = require("react-helmet-async");

var _AppRouters = _interopRequireDefault(require("AppRouters"));

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import { Switch, Route, BrowserRouter } from "react-router-dom";
// import DashboardLayout from "components/DashboardLayout/DashboardLayout";
// const Routers = [
//   {
//     path: 'admin', element: <DashboardLayout />
//   }
// ]
// export default Routers
function App() {
  var routing = (0, _reactRouterDom.useRoutes)(_AppRouters["default"]);
  return {
    routing: routing
  };
}

var _default = App;
exports["default"] = _default;