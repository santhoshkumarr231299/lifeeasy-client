import React from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import { RazorpayPaymentGateWay } from "../PaymentGateWay/PaymentGatewWay";
import { TextField, Button, Paper } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchIcon from "@mui/icons-material/Search";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import { CircularProgress } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Cards from "./Cards";
import CartImage from "./CartImage.jsx";
import {
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBRow,
} from "mdb-react-ui-kit";
import color from "material-ui-colors/dist/amber.js";

export default function MainMedicinePage(props) {
  const [option, setOption] = useState(0);
  const changeOption = (value) => {
    setOption(value);
  };
  const getMedicinePage = () => {
    switch (option) {
      case 1:
        return (
          <CartPage theme={props.theme} username={props.username} changeOption={changeOption} />
        );
      default:
        return <MedicinePage theme={props.theme} changeOption={changeOption} />;
    }
  };
  return <div>{getMedicinePage()}</div>;
}

function MedicinePage(props) {
  const [medicines, setMedicines] = useState([]);
  const [cartItemSize, setCartItemSize] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const updateMedicines = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post("/get-search-medicines", {
        searchWord: e.target.value,
      })
      .then((resp) => {
        setMedicines(resp.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data....");
        setIsLoading(false);
      });
  };

  const updateCartCount = () => {
    axios
      .post("/get-cart-items-count")
      .then((resp) => {
        setCartItemSize(resp.data.cartSize);
      })
      .catch((err) => {
        console.log("Can't get the Cart Items Count");
      });
  };

  const changeOption = (e) => {
    e.preventDefault();
    props.changeOption(1);
  };

  function changeToRightCase(strArr) {
    let str = "";
    if (strArr.length == 0) {
      return "";
    }
    strArr.forEach(
      (strVal) => (str += strVal[0].toUpperCase() + strVal.substr(1) + " ")
    );
    return str.trim();
  }

  useEffect(() => {
    setIsLoading(true);
    axios
      .post("/get-search-medicines", {
        searchWord: "",
      })
      .then((resp) => {
        setMedicines(resp.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching details...");
        setIsLoading(false);
      });
    updateCartCount();
  }, []);
  return (
    <Paper
      elevation={3}
      style={{
        alignSelf: "center",
        margin: "auto",
        backgroundColor: props.theme.background,
        width: "1560px",
        minHeight: "810px",
      }}>
      <div
        style={{
          width: "1055px",
          minHeight: "560px",
          margin: "auto",
          alignSelf: "center",
        }}>
        <div
          style={{
            width: "1095px",
            height: "100px",
          }}>
          <div
            style={{
              display: "flex",
              gap: "4rem",
              alignItems: "center",
              margin: "auto",
            }}>
            <OutlinedInput
              style={{
                width: "80%",
                margin: "25px 0px 20px 0px",
                zIndex: "0",
                placeholder : {
                  color : props.theme.fontColor
                }
              }}
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color : props.theme.fontColor }} />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  {isLoading && (
                    <CircularProgress
                      style={{ marginRight: "10px" }}
                      size={20}
                    />
                  )}
                </InputAdornment>
              }
              placeholder="Search Medicines..."
              onChange={(e) => updateMedicines(e)}
            />
            <Tooltip title="Cart" onClick={(e) => changeOption(e)} arrow>
              <Badge badgeContent={cartItemSize} color="warning">
                <ShoppingCartIcon sx={{ color : props.theme.fontColor }} />
              </Badge>
            </Tooltip>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gridGap: "5px",
          }}>
          {medicines.map((data) => (
            <Cards
              key={data.id}
              id={data.mid}
              name={data.mname}
              pharmacy={data.pharmacy}
              content={data.mcompany}
              mrp={data.medMrp}
              rate={data.medRate}
              updateCartCount={updateCartCount}
              changeToRightCase={changeToRightCase}
              img={process.env.REACT_APP_BASE_URL + "/medicine-image?mid=" + data.mid}
            />
          ))}
        </div>
      </div>
      <div style={{ padding: "7px" }}></div>
    </Paper>
  );
}

function CartPage(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [medList, setMedList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [mouseHover, setMouseHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  const updateTotAmt = () => {
    let amt = 0;
    medList.forEach((data) => {
      amt += +data.quantity * +data.price;
    });
    setMedList(amt);
  };
  const getCartItems = () => {
    setIsDataLoading(true);
    axios
      .post("/get-cart-items")
      .then((resp) => {
        let tempList = [];
        let amt = 0;
        resp.data.forEach((data) => {
          amt += +data.quantity * +data.price;
          tempList.push({
            id: data.id,
            mid: data.mid,
            medName: data.medName,
            quantity: data.quantity,
            price: data.price,
          });
        });
        setTotalAmount(() => amt.toFixed(2));
        setMedList(tempList);
        setIsDataLoading(false);
      })
      .catch((err) => {
        setIsDataLoading(false);
        console.log("Error fetching data...");
      });
  };

  function changeToRightCase(strArr) {
    let str = "";
    if (strArr.length == 0) {
      return "";
    }
    strArr.forEach(
      (strVal) => (str += strVal[0].toUpperCase() + strVal.substr(1) + " ")
    );
    return str.trim();
  }

  useEffect(() => {
    getCartItems();
  }, []);
  const changeOption = (e) => {
    e.preventDefault();
    props.changeOption(0);
  };

  const updateQuantity = (e, id) => {
    if (String(parseInt(e.target.value)) == "NaN") {
      return;
    }
    setIsUpdatingQuantity(true);
    axios
      .post("/update-cart-items", {
        newQuantity: e.target.value,
        mid: id,
      })
      .then((resp) => {
        if (resp.data.status === "success") {
          axios
            .post("/get-cart-items")
            .then((resp1) => {
              let tempList = [];
              let amt = 0;
              resp1.data.forEach((data) => {
                amt += +data.quantity * +data.price;
                tempList.push({
                  id: data.id,
                  mid: data.mid,
                  medName: data.medName,
                  quantity: data.quantity,
                  price: data.price,
                });
              });
              setTotalAmount(() => amt.toFixed(2));
              setMedList(tempList);
              setIsUpdatingQuantity(false);
            });
        } else {
          setIsUpdatingQuantity(false);
        }
      })
      .catch((err) => {
        console.log("Error updating Quantity...");
        setIsUpdatingQuantity(false);
      });
  };

  const openSnackBar = (status, message) => {
    setMessage(message);
    setSeverity(status);
    setOpen(true);
  };

  const makePayment = async (e) => {
    e.preventDefault();
    if (totalAmount > 50) {
      setIsLoading(true);

      RazorpayPaymentGateWay(openSnackBar, setIsLoading, getCartItems);

      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 4000);
    } else {
      setMessage("The Amount should be more than 50");
      setSeverity("warning");
      setOpen(true);
    }
  };

  const deleteItem = (e, id) => {
    axios
      .post("/delete-cart-items", {
        mid: id
      })
      .then((resp) => {
        if (resp.data.status === "success") {
          axios.post("/get-cart-items").then((resp1) => {
            let tempList = [];
            let amt = 0;
            resp1.data.forEach((data) => {
              amt += +data.quantity * +data.price;
              tempList.push({
                id: data.id,
                mid: data.mid,
                medName: data.medName,
                quantity: data.quantity,
                price: data.price,
              });
            });
            setTotalAmount(() => amt.toFixed(2));
            setMedList(tempList);
          });
        }
      });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          alignSelf: "center",
          margin: "auto",
          backgroundColor: props.theme.background,
          width: "1560px",
          minHeight: "810px",
        }}>
        <div
          style={{
            width: "1055px",
            minHeight: "560px",
            marginTop: "20px",
            margin: "auto",
            alignSelf: "center",
          }}>
          <div
            style={{
              width: "1095px",
              height: "100px",
              paddingRight: 43,
            }}>
            <div
              className="float-end"
              style={{
                paddingTop: "20px",
                display: "flex",
                gap: "4rem",
                alignItems: "center",
                margin: "auto",
                justifyContent: "center",
              }}>
              <span className="h3">
                {props.username[0].toUpperCase() +
                  props.username.substr(1) +
                  "'s"}{" "}
                Cart
              </span>
              <Button
                onClick={(e) => changeOption(e)}
                variant="contained"
                style={{ backgroundColor: "purple" }}>
                Back
              </Button>
            </div>
          </div>
          <div>
            {isDataLoading ? (
              <CircularProgress
                style={{ marginRight: "10px", alignSelf: "center" }}
                size={30}
              />
            ) : (
              medList.map((med) => (
                <div>
                  <MDBCard
                    style={{ backgroundColor: "#fcfafa" }}
                    className="mb-2">
                    <MDBCardBody className="p-1">
                      <MDBRow className="align-items-center">
                        <MDBCol md="1">
                          <CartImage mid={med.mid} />
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="d-flex justify-content-center">
                          <div>
                            <p className="lead fw-normal mb-0">{med.id}</p>
                          </div>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="d-flex justify-content-center"
                          style={{ width: "200px", marginLeft: 0 }}>
                          <div>
                            <p className="lead fw-normal mb-0">
                              <MDBIcon
                                fas
                                icon="circle me-2"
                                style={{ color: "#fdd8d2" }}
                              />
                              {changeToRightCase(med.medName.split(" "))}
                            </p>
                          </div>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="d-flex justify-content-center">
                          <div>
                            <p className="lead fw-normal mb-0">
                              <TextField
                                style={{
                                  margin: 10,
                                  padding: 0,
                                  width: "80px",
                                }}
                                label="Quantity"
                                id="filled-number"
                                type="number"
                                onChange={(e) => updateQuantity(e, med.mid)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                variant="outlined"
                                defaultValue={med.quantity}
                              />
                            </p>
                          </div>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="d-flex justify-content-center">
                          <div>
                            <p className="lead fw-normal mb-0">₹ {med.price}</p>
                          </div>
                        </MDBCol>
                        <MDBCol
                          md="2"
                          className="d-flex justify-content-center">
                          <div>
                            <p className="lead fw-normal mb-0">
                              <div key={med.mid}>
                                <IconButton
                                  aria-label="delete"
                                  onClick={(e) => deleteItem(e, med.mid)}>
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            </p>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              ))
            )}
            <MDBCard className="mb-5">
              <MDBCardBody
                className="p-4"
                style={{ backgroundColor: "#fcfafa" }}>
                <div className="float-end">
                  <p className="mb-0 me-5 d-flex align-items-center">
                    <span className="small text-muted me-2">Order total:</span>
                    <span className="lead fw-normal">
                      {isUpdatingQuantity ? (
                        <CircularProgress
                          style={{ marginRight: "10px" }}
                          size={20}
                        />
                      ) : (
                        "₹" + totalAmount
                      )}
                    </span>
                  </p>
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div>
            <MDBCard className="mb-4" style={{ width: "100%" }}>
              <MDBCardBody
                className="p-2 d-flex flex-row"
                style={{ alignItems: "center", backgroundColor: "#fcfafa" }}>
                <MDBInput
                  style={{ height: "40px" }}
                  placeholder="Discound code"
                  wrapperClass="flex-fill"
                />
                <Button
                  onClick={(e) => console.log("Apply Coupon is Clicked")}
                  variant="outlined"
                  style={{
                    height: "40px",
                    color: mouseHover ? "white" : "purple",
                    borderColor: "purple",
                    backgroundColor: mouseHover ? "purple" : "",
                    margin: "10px",
                  }}
                  onMouseEnter={() => setMouseHover(true)}
                  onMouseLeave={() => setMouseHover(false)}>
                  Apply
                </Button>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div
            style={{
              textAlign: "right",
            }}>
            <Button
              onClick={(e) => makePayment(e)}
              variant="contained"
              style={{ backgroundColor: "purple", marginBottom: "15px" }}
              disabled={isLoading}>
              {isLoading && (
                <CircularProgress style={{ marginRight: "10px" }} size={20} />
              )}
              PROCEED TO PAY
            </Button>
          </div>
        </div>
      </Paper>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
