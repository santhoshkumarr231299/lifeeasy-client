import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "../../../api/axios.js";
import SendOTPForm from "./components/SendOTPForm.tsx";
import VerificationForm from "./components/VerificationForm.tsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Screen/SubscribeToServicePage/Navbar.jsx";
import LogoutPage from "../../../Screen/LogoutPage/LogoutPage.jsx";

function TwoFactorAuthentication() {
    const [isSentOTP, setIsSentOTP] = useState(false);
    const [logout, setLogout] = useState(false); 

    const [pharmacyName, setPharmacyName] = useState(" ");
    const [username, setUsername] = useState(" ");

    const navigate = useNavigate();
    useEffect(() => {
        axios.post("/logged-in").then((res) => {
            if (res.data?.username && res.data.username !== "") {
                setPharmacyName(res.data.pharmacy);
                setUsername(res.data.username);
                if(!(res.data?.isTFAEnabled && !res.data?.isTFAVerified)) {
                    navigate("/home");
                }
            } else {
                navigate("/login");
            }
        })
    })

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
        <div>
            <Navbar 
                pharmacy={pharmacyName}
                username={username}
                setLogout={setLogout}
            />
            <div className="two-factor-authenticate">
                <Card style={style.card} >
                    <Card.Title style={style.title}>
                        <b>Two Factor Authentication</b>
                    </Card.Title>
                    <Card.Body>
                        {isSentOTP ? <VerificationForm /> : <SendOTPForm setIsSentOTP={setIsSentOTP} />}
                    </Card.Body>
                </Card>
            </div>
            { logout && <LogoutPage close={() => setLogout(false)} /> }
        </div>
    );
}

export default TwoFactorAuthentication;