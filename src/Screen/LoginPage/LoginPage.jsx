import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card, Alert } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "../../api/axios";
import { CircularProgress } from "@mui/material";

function LoginPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [alertType, setAlertType] = useState();
  const [alert, setAlert] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [hoverColor, setHoverColor] = useState("black");
  const [opacity, setOpacity] = useState("60%");
  const [selectDisp, setSelectDisp] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const username = useRef();
  const password = useRef();
  const pharmaciesRef = useRef();

  async function isLoggedIn() {
    await axios
      .post("/logged-in", {
        secretKey: Cookies.get("secretKey"),
      })
      .then((res) => {
        if (res.data.username !== "") {
          navigate("/home");
        }
      });
  }

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn();
  }, []);
  const validateLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
      axios
    .post("/logged-in", {
      secretKey: Cookies.get("secretKey"),
    })
    .then((res) => {
      if (res.data.username !== "") {
        setIsLoading(false);
        navigate("/home");
        return;
      } else {
          axios
        .post("/login", {
          username: username.current.value,
          password: password.current.value,
          pharmacy: selectDisp ? pharmaciesRef.current.value : "",
        })
        .then((res) => {
          if (res.data.message === "success") {
            Cookies.set("secretKey", res.data.secretKey, { expires: 1 });
            setIsLoading(false);
            navigate("/home");
          } else {
            setIsLoading(false);
            setAlertType("danger");
            setAlert(() => res.data.comment);
            setOpenAlert(() => true);
          }
    });
      }
    });
  };

  const handleChecked = (e) => {
    setSelectDisp(e.target.checked);
  };

  const fields = [
    {
      fieldName: "username",
      labelName: "Username",
      type: "text",
      required: true,
      reference: username,
    },
    {
      fieldName: "password",
      labelName: "Password",
      type: "password",
      required: true,
      reference: password,
    },
    {
      fieldName: "pharmacies",
      labelName: "Pharmacies",
      type: "select",
      select: pharmacies,
      reference: pharmaciesRef,
    },
  ];

  // useEffect(() => {
  //   axios.get("http://localhost:3000/get-created-pharmacies").then((resp) => {
  //     setPharmacies(resp.data.pharmacies);
  //   });
  // }, []);

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
          <div
            style={{
              display: "flex",
              gap: "2rem",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ color: "purple" }}>Sign In</div>
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
              onClick={() => navigate("/newuser")}
            >
              New User?
            </div>
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
              <div key={field.fieldName}>
                {field.type !== "select" && (
                  <Form.Group className="mb-3" controlId={field.fieldName}>
                    <Form.Label>{field.labelName}</Form.Label>
                    <Form.Control
                      type={field.type}
                      ref={field.reference}
                      placeholder={field.labelName}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                )}

                {/* {field.type === "select" && (
                  <Form.Select
                    style={{
                      marginBottom: "20px",
                      display: selectDisp ? "inline" : "none",
                    }}
                    aria-label="Default select example"
                    ref={field.reference}
                  >
                    {field.select.map(
                      (data) =>
                        data !== "" && <option value={data}>{data}</option>
                    )}
                  </Form.Select>
                )} */}
              </div>
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
              onClick={(e) => validateLogin(e)}
              disabled={isLoading}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div>{isLoading && <CircularProgress size={20} />}</div>
                <div>Log In</div>
              </div>
            </Button>
            {/* <div style={{ margin: "10px", display: "flex", gap: "10px" }}>
              <div>
                <Form.Check onChange={(e) => handleChecked(e)} />
              </div>
              <div className="org-login" style={{ opacity: "60%" }}>
                Organization Login
              </div>
            </div> */}
            <div
              style={{
                margin: "10px",
                textAlign: "center",
              }}
            >
              <a
                onMouseEnter={() => setHoverColor("purple")}
                onMouseLeave={() => setHoverColor("black")}
                style={{
                  color: hoverColor,
                }}
                onClick={() => navigate("/forgotpass")}
              >
                Forgot your password?
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginPage;
