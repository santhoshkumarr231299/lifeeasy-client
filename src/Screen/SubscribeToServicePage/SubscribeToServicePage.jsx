import React, { useState, useEffect } from "react";
import { RazorpayPaymentGateWaySubscription, activateYourFreeTrail } from "../PaymentGateWay/PaymentGatewWay";
import Snackbar from "@mui/material/Snackbar";
import { CircularProgress } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import LogoutPage from "../LogoutPage/LogoutPage";

function SubscribeToServicePage({ theme }) {
    const [user, setUser] = useState({});
    const [logout, setLogout] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isMonthlyClicked, setIsMonthlyClicked] = useState(false);
    const [isYearlyClicked, setIsYearlyClicked] = useState(false);
    const [isFreeTrailClicked, setIsFreeTrailClicked] = useState(false);

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleClose = () => {
        setMessage("");
        setSeverity("success");
        setOpen(false);
      };

    const openSnackBar = (status, message) => {
        setMessage(message);
        setSeverity(status);
        setOpen(true);
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });
    const goToHome = () => {
        navigate('/home');
    }

    function freeTrail() {
      setIsLoading(true);
      setIsFreeTrailClicked(true);
      activateYourFreeTrail(openSnackBar, goToHome);
    }

    function MonthlyPayment() {
        setIsLoading(true);
        setIsMonthlyClicked(true);
        RazorpayPaymentGateWaySubscription(openSnackBar, "monthly",goToHome);
    }
    function YearlyPayment() {
        setIsLoading(true);
        setIsYearlyClicked(true);
        RazorpayPaymentGateWaySubscription(openSnackBar, "yearly",goToHome);
    }
    
    const Logout = (e) => {
        e.preventDefault();
        setLogout(true);
    }

    useEffect(() => {
        axios
          .post("/logged-in")
          .then((res) => {
            if (res.data.username == "") {
              navigate("/login");
            } else {
              setUser({
                username: res.data.username,
                role: res.data.role,
                pharmacy: res.data.pharmacy,
                subscriptionPack : res.data.subscriptionPack,
                theme : res.data.theme
              });
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
                // navigate("/subscribe");
              }
            }
          });
      }, []);

    return (
        <div>
            <Navbar
                pharmacy={user ? user.pharmacy ?  user.pharmacy : " " : " "}
                username={user ? user.username ? user.username : " " : " "}
                setLogout={setLogout}
                theme={user?.theme}  
            />
            <div 
            className="subscribe-screen">
              { user && user.subscriptionPack && (user.subscriptionPack == 'none') && 
                    <div className="subs-card" style={{ backgroundColor: user?.theme?.background, color: user?.theme?.fontColor }}>
                    <form>
                        <h3 className="subs-title">Free Trail</h3>
                            <ul>
                                <li>Admin Login</li>
                                <li>Manager Login</li>
                                <li>Pharmacist Login</li>
                                <li>Delivery Man Login</li>
                                <li>Assign Custom User Previleges</li>
                                <li>Unlimited Access to all the resources</li>
                            </ul>
                            <div className="price-tag"><h1 className="rate">₹10</h1><h2>₹0</h2></div>
                            <p>1 month free trail</p>
                        <button type="button" disabled={isLoading} onClick={(e) => freeTrail()}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div>{isFreeTrailClicked && <CircularProgress size={20} />}</div>
                          <div>Start Your Free Trail</div>
                        </div>
                        </button>
                    </form>                
                </div>
              }
                <div className="subs-card" style={{ backgroundColor: user?.theme?.background, color: user?.theme?.fontColor }}>
                    <form>
                         <h3 className="subs-title">Monthly Subscription</h3>
                            <ul>
                                <li>Admin Login</li>
                                <li>Manager Login</li>
                                <li>Pharmacist Login</li>
                                <li>Delivery Man Login</li>
                                <li>Assign Custom User Previleges</li>
                                <li>Unlimited Access to all the resources</li>
                            </ul>
                            <div className="price-tag"><h1>₹10</h1></div>
                            <p>1 month subscription</p>
                         <button type="button" disabled={isLoading} onClick={(e) => MonthlyPayment()}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <div>{isMonthlyClicked && <CircularProgress size={20} />}</div>
                            <div>Buy Now</div>
                          </div>
                         </button>
                    </form>
                </div>
                <div className="subs-card" style={{ backgroundColor: user?.theme?.background, color: user?.theme?.fontColor }}>
                    <form>
                        <h3 className="subs-title">Yearly Subscription</h3>
                            <ul>
                                <li>Admin Login</li>
                                <li>Manager Login</li>
                                <li>Pharmacist Login</li>
                                <li>Delivery Man Login</li>
                                <li>Assign Custom User Previleges</li>
                                <li>Unlimited Access to all the resources</li>
                            </ul>
                            <div className="price-tag"><h1 className="rate">₹120</h1><h2>₹100</h2></div>
                            <p>1 year subscription</p>
                        <button type="button" disabled={isLoading} onClick={(e) => YearlyPayment()}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                          }}
                        >
                          <div>{isYearlyClicked && <CircularProgress size={20} />}</div>
                          <div>Buy Now</div>
                        </div>
                        </button>
                    </form>                
                </div>
            </div>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
            { logout && <LogoutPage close={() => setLogout(false)} /> }
        </div>
    )
}

export default SubscribeToServicePage;