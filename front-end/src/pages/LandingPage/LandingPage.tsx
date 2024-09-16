import React from "react";
import { Link } from "react-router-dom";

const LandingPage:React.FC = () => {
    return (
        <div>
            Hello, welcome to SavvyCSV!
            <button>
                <Link to='/signin'>Sign In</Link>
            </button>
        </div>
    );
}

export default LandingPage
