import Lottie from "lottie-react";
import animationData from '../../assets/lottie-2.json';
import React from "react";
var SignInLottie = function () {
    return (React.createElement("div", null,
        React.createElement(Lottie, { animationData: animationData, loop: true })));
};
export default SignInLottie;
