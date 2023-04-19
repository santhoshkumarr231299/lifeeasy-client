import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { Button, Form, Card, Alert } from "react-bootstrap";
import { validatePassword } from "../../Validations/validations";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";

function ForgotPassPage() {
  const [alertType, setAlertType] = useState();
  const [alert, setAlert] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [hoverColor, setHoverColor] = useState("black");
  const [otpField, setOtpField] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const username = useRef();
  const newPassword = useRef();
  const conNewPassword = useRef();
  const otp = useRef();

  const navigate = useNavigate();

  const fields = [
    {
      fieldName: "username",
      type: "text",
      labelName: "Username",
      placeholder: "Enter Username to Send OTP",
      display: true,
      reference: username,
      disabled: otpField,
    },
    {
      fieldName: "OTP",
      type: "number",
      labelName: "OTP",
      placeholder: "Enter OTP",
      display: otpField,
      reference: otp,
      disabled: false,
    },
    {
      fieldName: "newpass",
      type: "text",
      labelName: "New Password",
      placeholder: "New Password",
      display: true,
      reference: newPassword,
      disabled: !otpField,
    },
    {
      fieldName: "confirmnewpass",
      type: "password",
      labelName: "Confirm New Password",
      placeholder: "Confirm New Password",
      display: true,
      reference: conNewPassword,
      disabled: !otpField,
    },
  ];
  const changePassword = async (e) => {
    e.preventDefault();
    await axios
      .post("/logged-in", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((res) => {
        if (res.data.username !== "") {
          let today = new Date();
          let DateOfSubscription = new Date(res.data.DateOfSubscription);
          console.log('remaining days : ',((today - DateOfSubscription)/(1000*60*60*24)));
          if(res.data.pharmacy == "") {
            navigate("/home");
          } else if(res.data.subscriptionPack == 'monthly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 30)) {
            navigate("/home");
          } else if(res.data.subscriptionPack == 'yearly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 365)) {
            navigate("/home");
          } else {
            navigate("/subscribe");
          }
          return ;
        }
      });
    const userForgotPassDetails = {
      username: username.current.value,
      newPass: newPassword.current.value,
      conNewPass: conNewPassword.current.value,
      otp: otp.current.value,
      secretKey: Cookies.get("forgot-pass-key"),
    };
    setIsLoading(true);
    if (otpField) {
      if (userForgotPassDetails.newPass !== userForgotPassDetails.conNewPass) {
        setAlertType("danger");
        setAlert(() => "Password Mismatch");
        setOpenAlert(true);
        setIsLoading(false);
        return;
      }
      let valid = validatePassword(newPassword.current.value);
      if (valid && valid.length > 0) {
        setAlertType("warning");
        setAlert(valid);
        setOpenAlert(true);
        setIsLoading(false);
        return;
      }

      await axios
        .post("/forgot-pass-change", userForgotPassDetails)
        .then((resp) => {
          if (resp.data) {
            if (resp.data.status === "success") {
              setTimeout(() => {
                setAlertType("success");
                setAlert(() => resp.data.message);
                setOpenAlert(true);
                setIsLoading(false);
              }, 2500);
              setTimeout(() => {
                goToLoginPage();
                setIsLoading(false);
              }, 4500);
            } else {
              setTimeout(() => {
                setAlertType("danger");
                setAlert(() => resp.data.message);
                setOpenAlert(true);
                setIsLoading(false);
              }, 2000);
            }
          }
        })
        .catch(() => {
          setTimeout(() => {
            setAlertType("danger");
            setAlert(() => "Something went wrong");
            setOpenAlert(true);
            setIsLoading(false);
          }, 2000);
        });
    } else {
      await axios
        .post("/security/generate-email", userForgotPassDetails)
        .then((resp) => {
          if (resp.data) {
            if (resp.data.status === "success") {
              setTimeout(() => {
                setAlertType("success");
                setAlert(() => resp.data.message);
                setOpenAlert(true);
                setIsLoading(false);
                setOtpField(true);
              }, 2500);

              Cookies.set("forgot-pass-key", resp.data.secretKey, {
                expires: 1,
              });
            } else {
              setTimeout(() => {
                setAlertType("danger");
                setAlert(() => resp.data.message);
                setOpenAlert(true);
                setIsLoading(false);
              }, 2000);
            }
          }
        })
        .catch(() => {
          setTimeout(() => {
            setAlertType("danger");
            setAlert(() => "Something went wrong");
            setOpenAlert(true);
            setIsLoading(false);
          }, 2000);
        });
    }
  };
  const goToLoginPage = () => {
    navigate("/login");
  };

  async function isLoggedIn() {
    await axios
      .post("/logged-in", {
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((res) => {
        if (res.data.username !== "") {
          let today = new Date();
          let DateOfSubscription = new Date(res.data.DateOfSubscription);
          console.log('remaining days : ',((today - DateOfSubscription)/(1000*60*60*24)));
          if(res.data.pharmacy == "") {
            navigate("/home");
          } else if(res.data.subscriptionPack == 'monthly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 30)) {
            navigate("/home");
          } else if(res.data.subscriptionPack == 'yearly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 365)) {
            navigate("/home");
          } else {
            navigate("/subscribe");
          }
        }
      });
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <div
      style={{
        marginTop: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          minHeight: "250px",
          minWidth: "400px",
        }}
      >
        <Card.Title
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <div className="super-title">
            <div className="app-name">
              <div className="app-name-first">Pharm</div>
              <div className="app-name-second">Simple</div>
            </div>
          </div>
          Forgot Password
        </Card.Title>
        <Card.Body>
          <Form
            style={{
              margin: "2vh",
              marginTop: 0,
            }}
          >
            {fields.map((field) => (
              <Form.Group
                style={{
                  display: field.display ? "" : "none",
                }}
                key={field.fieldName}
                className="mb-3"
                controlId={field.fieldName}
              >
                <Form.Label>{field.labelName}</Form.Label>
                <Form.Control
                  type={field.type}
                  ref={field.reference}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
                <Form.Text className="text-muted"></Form.Text>
              </Form.Group>
            ))}
            <Alert
              variant={alertType}
              style={{
                display: openAlert ? "" : "none",
              }}
            >
              {alert}
            </Alert>
            <Button
              style={{
                marginTop: "2vh",
                width: "100%",
                backgroundColor: "purple",
              }}
              variant="primary"
              type="submit"
              onClick={(e) => changePassword(e)}
              disabled={isLoading}
            >
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              {!otpField ? "Send OTP" : "Change Password"}
            </Button>
            <div
              style={{
                margin: "10px",
                textAlign: "center",
              }}
            >
              <a
                onMouseEnter={() => setHoverColor("purple")}
                onMouseLeave={() => setHoverColor("black")}
                onClick={() => goToLoginPage()}
                style={{
                  color: hoverColor,
                }}
              >
                Go to Login Page...
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ForgotPassPage;
