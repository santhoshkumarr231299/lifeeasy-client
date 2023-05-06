import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Cookies from "js-cookie";
import { Button, Form, Card, Alert } from "react-bootstrap";
import { CircularProgress } from "@mui/material";
import {
  validateUsername,
  validatePassword,
  validatePhoneNumber,
  validatePharmacyName,
  validateEmail,
} from "../../Validations/validations";

function NewUserPage() {
  const [alertType, setAlertType] = useState();
  const [alert, setAlert] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [hoverColor, setHoverColor] = useState("black");
  const [opacity, setOpacity] = useState("60%");
  const [dispProp, setDispProp] = useState(false);
  const [otpField, setOtpField] = useState(false);

  const username = useRef();
  const password = useRef();
  const email = useRef();
  const phoneNumber = useRef();
  const pharmacyName = useRef();
  const otp = useRef();
  const conPassword = useRef();

  const navigate = useNavigate();

  const fields = [
    {
      fieldName: "username",
      type: "text",
      labelName: "Username",
      placeholder: "Username",
      required: true,
      reference: username,
    },
    {
      fieldName: "password",
      type: "text",
      labelName: "Password",
      placeholder: "Password",
      required: true,
      reference: password,
    },
    {
      fieldName: "conpassword",
      type: "password",
      labelName: "Confirm Password",
      placeholder: "Confirm Password",
      required: true,
      reference: conPassword,
    },
    {
      fieldName: "phone",
      type: "number",
      labelName: "Phone Number",
      placeholder: "Phone Number",
      required: true,
      reference: phoneNumber,
    },
    {
      fieldName: "email",
      type: "email",
      labelName: "Email",
      placeholder: "Email",
      required: true,
      reference: email,
    },
    {
      fieldName: "otp",
      type: "number",
      labelName: "Email Verification (OTP) *",
      placeholder: "Enter OTP",
      required: otpField ? "" : "none",
      reference: otp,
    },
    {
      fieldName: "pharmacyname",
      type: "text",
      labelName: "Pharmacy Name",
      placeholder: "Pharmacy Name",
      required: dispProp ? "" : "none",
      reference: pharmacyName,
    },
  ];

  const handleChecked = (e) => {
    setDispProp(e.target.checked);
  };

  const createUser = async (e) => {
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
          return;
        }
      });
    const user = {
      username: username.current.value,
      password: password.current.value,
      email: email.current.value,
      mobileNumber: phoneNumber.current.value,
      pharmacyName: dispProp ? pharmacyName.current.value : "",
      otp: otp.current.value,
      secretKey: Cookies.get("newuser-key"),
    };
    let valid = validation();
    if (valid && valid.length > 0) {
      setAlertType("warning");
      setAlert(valid);
      setOpenAlert(true);
      return;
    } else {
      setIsLoading(true);
      axios
        .post("/check-username", {
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber,
        })
        .then((response) => {
          if (response.data.status === "success") {
            if (otpField) {
              axios
                .post("/new-user", user)
                .then((resp) => {
                  if (resp.data) {
                    setAlert(() => resp.data.message);

                    if (resp.data.status === "success") {
                      setAlertType("success");
                      setOpenAlert(true);
                      setTimeout(() => {
                        setIsLoading(false);
                        goToLoginPage();
                      }, 4500);
                    } else {
                      setAlertType("danger");
                      setOpenAlert(true);
                      setTimeout(() => setIsLoading(false), 2000);
                    }
                  } else {
                    setAlertType("danger");
                    setAlert(() => resp.data.message);
                    setOpenAlert(true);
                    setIsLoading(false);
                  }
                })
                .catch((err) => {
                  setAlertType("danger");
                  setAlert(() => "Something went wrong");
                  setOpenAlert(true);
                  setIsLoading(false);
                });
            } else {
              axios
                .post("/security/verify-email", user)
                .then((resp) => {
                  if (resp.data) {
                    if (resp.data.status === "success") {
                      setAlertType("success");
                      setAlert(() => resp.data.message);
                      setOpenAlert(true);
                      setIsLoading(false);

                      Cookies.set(process.env.REACT_APP_SECRET_NEW_USER_AUTH_KEY, resp.data.secretKey, {
                        expires: 1,
                      });

                      setOtpField(true);
                    } else {
                      setAlertType("danger");
                      setAlert(() => resp.data.message);
                      setOpenAlert(true);
                      setIsLoading(false);
                    }
                  } else {
                    setAlertType("danger");
                    setAlert(() => "Something went wrong in fetching data");
                    setOpenAlert(true);
                    setIsLoading(false);
                  }
                })
                .catch((err) => {
                  setAlertType("danger");
                  setAlert(() => "Something went wrong");
                  setOpenAlert(true);
                  setIsLoading(false);
                });
            }
          } else {
            setAlertType("danger");
            setAlert(() => response.data.message);
            setOpenAlert(true);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          setAlertType("danger");
          setAlert(() => "Something went wrong");
          setOpenAlert(true);
          setIsLoading(false);
        });
    }
  };
  const goToLoginPage = () => {
    navigate("/login");
  };

  const validation = () => {
    let valid = validateUsername(username.current.value);
    if (valid && valid.length > 0) {
      return valid;
    }
    if(conPassword.current.value != password.current.value) {
      return "Password - Confirm Password Mismatch";
    }
    valid = validatePassword(password.current.value);
    if (valid && valid.length > 0) {
      return valid;
    }
    valid = validatePhoneNumber(phoneNumber.current.value);
    if (valid && valid.length > 0) {
      return valid;
    }
    valid = validateEmail(email.current.value);
    if (valid && valid.length > 0) {
      return valid;
    }
    if (dispProp) {
      valid = validatePharmacyName(pharmacyName.current.value);
      if (valid && valid.length > 0) {
        return valid;
      }
    }
    return "";
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
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <div
      style={{
        marginTop: "5%",
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
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "80%",
                opacity: opacity,
              }}
              onMouseEnter={() => {
                setOpacity("100%");
              }}
              onMouseLeave={() => {
                setOpacity("60%");
              }}
              onClick={() => goToLoginPage()}
            >
              Sign In
            </div>
            <div style={{ color: "purple" }}>New User</div>
          </div>
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
                key={field.fieldName}
                style={{ display: field.required }}
                className="mb-3"
                controlId={field.fieldName}
              >
                <Form.Label>{field.labelName}</Form.Label>
                <Form.Control
                  type={field.type}
                  ref={field.reference}
                  placeholder={field.placeholder}
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
                width: "100%",
                backgroundColor: "purple",
              }}
              variant="primary"
              type="submit"
              onClick={(e) => createUser(e)}
              disabled={isLoading}
            >
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              {!otpField ? "Verify Email" : "Create Account"}
            </Button>
            <div style={{ margin: "10px", display: "flex", gap: "10px" }}>
              <div>
                <Form.Check
                  disabled={isLoading}
                  onChange={(e) => handleChecked(e)}
                />
              </div>
              <div className="org-login">Organizational account</div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NewUserPage;
