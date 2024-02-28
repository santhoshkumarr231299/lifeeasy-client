import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import axios from "../../../api/axios.js";
import { CircularProgress } from "@mui/material";
import SendOTPForm from "./components/SendOTPForm.tsx";
import VerificationForm from "./components/VerificationForm.tsx";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Screen/SubscribeToServicePage/Navbar.jsx";
import LogoutPage from "../../../Screen/LogoutPage/LogoutPage.jsx";

function TwoFactorAuthentication() {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");
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
            height: "30%"
        },
        title : {
            display: "flex",
            justifyContent: "center",
            margin: "25px"
        },
    }

    const handleClose = () => {
        setMessage("");
        setSeverity("success");
        setOpen(false);
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

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
                        {isSentOTP ? <VerificationForm /> : <SendOTPForm setIsSentOTP={setIsSentOTP} setOpen={setOpen} setSeverity={setSeverity} setMessage={setMessage} />}
                    </Card.Body>
                </Card>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>    
                        {message}
                    </Alert>
                </Snackbar>
            </div>
            { logout && <LogoutPage close={() => setLogout(false)} /> }
        </div>
    );
}

export default TwoFactorAuthentication;