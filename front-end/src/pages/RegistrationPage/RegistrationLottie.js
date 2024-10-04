import Lottie from "lottie-react";
import animationData from '../../assets/lottie-1.json';
import React from "react";
var RegistrationLottie = function () {
    return (React.createElement("div", null,
        React.createElement(Lottie, { animationData: animationData, loop: true })));
};
export default RegistrationLottie;
