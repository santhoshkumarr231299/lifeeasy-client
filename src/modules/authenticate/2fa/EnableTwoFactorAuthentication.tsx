import React, { useState } from "react";
import ESendOTPForm from "./components/ESendOTPForm.tsx";
import EVerificationForm from "./components/EVerificationForm.tsx";

function EnableTwoFactorAuthentication({ isTFAEnabled }) {
    const [isSentOTP, setIsSentOTP] = useState(false);

    let style = {
        card : {
            width: "50%",
            height: "40%"
        },
        title : {
            display: "flex",
            justifyContent: "center",
            margin: "25px"
        },
    }

    return(
            <div className="two-factor-authenticate-enable">
                <div><h4>Two Factor Authentication</h4></div>
                <div>
                    {isSentOTP ? <EVerificationForm isTFAEnabled={isTFAEnabled} /> : <ESendOTPForm setIsSentOTP={setIsSentOTP} />}
                </div>
            </div>
    );
}

export default EnableTwoFactorAuthentication;