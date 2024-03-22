import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import axios from "../../../../api/axios.js";
import { CircularProgress } from "@mui/material";

function ESendOTPForm({  setIsSentOTP, theme }) {
    const [email, setEmail] = useState("*****@***.com");
    const twoFAOtp = useRef();
    const [isSendOTPClicked, setIsSentOTPClicked] = useState(false);

    const [alertType, setAlertType] = useState();
    const [alert, setAlert] = useState("Dummy");
    const [openAlert, setOpenAlert] = useState(false);

    const sendOTP = () => {
        setIsSentOTPClicked(() => true);
        axios.post("/2fa/send-otp").then((res) => {
            if(res.data.status == "success") {
                setAlertType("success");
                setAlert(res.data.message);
                setOpenAlert(() => true);
                setTimeout(() => {
                    setIsSentOTP(()=> true)
                }, 3000);
            } else {
                setAlertType("danger");
                setAlert(res.data.message);
                setOpenAlert(() => true)
                setIsSentOTP(() => false);
            }
            setIsSentOTPClicked(() => false);
        }).catch(e => {
            setIsSentOTPClicked(() => false);
            setIsSentOTP(() => false);
        })
    }
    const getTwoFAuthDetails = () => {
        axios.get("/2fa/get-details").then((res) => {
            setEmail(res.data.email);
        }).catch(e => {
            //
        });
    }

    useEffect(() => {
        getTwoFAuthDetails();
    }, []);

    return(
        <React.Fragment>
            <Form style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <div style={{ margin : "10px", fontWeight: "5px" }} >
                        The OTP will be send to the below Email  
                    </div>
                    <div>
                        <b>{email}</b>
                    </div>
                    <div 
                        style={{
                                marginTop : "20px",
                                opacity: openAlert ? "100%" : "0%",
                            }}
                    >
                        <Alert variant={alertType}>
                            {alert}
                        </Alert>
                    </div>
                </div>
                <Button
                    style={{
                        width: "10%",
                        backgroundColor: theme.others,
                        margin: "20px"
                    }}
                    variant="primary"
                    type="button"
                    onClick={() => sendOTP()}
                    disabled={false}
                >
                <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    }}
                >
                    {isSendOTPClicked && <CircularProgress size={20} />}
                    <div>Send OTP</div>
                </div>
            </Button>
            </Form>
        </React.Fragment>
    );
}

export default ESendOTPForm;