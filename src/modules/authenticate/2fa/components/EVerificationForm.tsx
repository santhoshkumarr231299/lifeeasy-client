import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Card, Alert } from "react-bootstrap";
import axios from "../../../../api/axios.js";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function EVerificationForm({ isTFAEnabled, theme }) {
    const navigate = useNavigate();
    const twoFAOtp = useRef();
    const [isVerifyOTPClicked, setIsVerifyOTPClicked] = useState(false);

    const [alertType, setAlertType] = useState();
    const [alert, setAlert] = useState("Dummy");
    const [openAlert, setOpenAlert] = useState(false);

    const removeCookie = () => {
        try {
          Cookies.remove(process.env.REACT_APP_SECRET_COOKIE_KEY);
        } catch (e) {
          //
        } finally {
          localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS);
        }
      }

    const enableTFA = () => {
        const otp : number = twoFAOtp.current.value;
        setIsVerifyOTPClicked(() => true);
        axios.post("/2fa/enable", {
            otp : otp
        }).then((res) => {
            if(res.data.status == "success") {
                setAlertType("success");
                setAlert(res.data.message);
                setOpenAlert(() => true);
                removeCookie();
                setTimeout(() => {
                    navigate("/login");
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

    const disbaleTFA = () => {
        const otp : number = twoFAOtp.current.value;
        setIsVerifyOTPClicked(() => true);
        axios.post("/2fa/disable", {
            otp : otp
        }).then((res) => {
            if(res.data.status == "success") {
                setAlertType("success");
                setAlert(res.data.message);
                setOpenAlert(() => true);
                setTimeout(() => {
                    window.location.reload();
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
                        backgroundColor: theme.others,
                        margin: "20px"
                    }}
                    variant="primary"
                    type="button"
                    onClick={() => {
                        if(isTFAEnabled) disbaleTFA();
                        else enableTFA();
                    }}
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
                    <div>Verify and {isTFAEnabled ? "Disable" : "Enable"} TFA</div>
                </div>
            </Button>
            </Form>
        </React.Fragment>
    );
}

export default EVerificationForm;