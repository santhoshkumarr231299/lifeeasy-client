import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import axios from "../../../../api/axios.js";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function VerificationForm() {
    const navigate = useNavigate();
    const twoFAOtp = useRef();
    const [isVerifyOTPClicked, setIsVerifyOTPClicked] = useState(false);

    const [alertType, setAlertType] = useState();
    const [alert, setAlert] = useState("Dummy");
    const [openAlert, setOpenAlert] = useState(false);

    const verifyOTP = () => {
        const otp : number = twoFAOtp.current.value;
        setIsVerifyOTPClicked(() => true);
        axios.post("/2fa/verify-otp", {
            otp : otp
        }).then((res) => {
            if(res.data.status == "success") {
                setAlertType("success");
                setAlert(res.data.message);
                setOpenAlert(() => true);
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            } else {
                setAlertType("danger");
                setAlert(res.data.message);
                setOpenAlert(() => true);
                setIsVerifyOTPClicked(() => false);
            }
        }).catch(e => {
            setAlertType("danger");
            setAlert("Something went wrong");
            setOpenAlert(() => true);
            setIsVerifyOTPClicked(() => false);
        })
    }

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
                    <div>
                        <Form.Group className="mb-3" controlId="verify-otp">
                        <Form.Label>Enter OTP sent to the Mail</Form.Label>
                        <Form.Control
                            type="number"
                            ref={twoFAOtp}
                            placeholder="OTP"
                        />
                    </Form.Group>
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
                        width: "20%",
                        backgroundColor: "purple",
                        margin: "20px"
                    }}
                    variant="primary"
                    type="button"
                    onClick={() => verifyOTP()}
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
                    {isVerifyOTPClicked && <CircularProgress size={20} />}
                    <div>Verify OTP</div>
                </div>
            </Button>
            </Form>
        </React.Fragment>
    );
}

export default VerificationForm;