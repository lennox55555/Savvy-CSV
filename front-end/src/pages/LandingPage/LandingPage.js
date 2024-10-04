import React from "react";
import { Link } from "react-router-dom";
var LandingPage = function () {
    return (React.createElement("div", null,
        "Hello, welcome to SavvyCSV!",
        React.createElement("button", null,
            React.createElement(Link, { to: '/signin' }, "Sign In"))));
};
export default LandingPage;
