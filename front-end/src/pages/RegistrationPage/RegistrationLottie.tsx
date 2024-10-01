import Lottie from "lottie-react";
import animationData from '../../assets/lottie-1.json'
import React from "react";

const RegistrationLottie: React.FC = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
}

export default RegistrationLottie
