import Lottie from "lottie-react";
import animationData from '../../assets/lottie-2.json'
import React from "react";

const SignInLottie = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}

export default SignInLottie