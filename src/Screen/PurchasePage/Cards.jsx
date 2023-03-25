import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "../../api/axios";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Cookies from "js-cookie";

export default function ImgMediaCard(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const addToCart = async (e, medName) => {
    e.preventDefault();
    await axios
      .post("/add-to-cart", {
        mid: props.id,
        medName: props.name,
        quantity: 20,
        secretKey: Cookies.get("secretKey"),
      })
      .then((resp) => {
        setOpen(true);
        setSeverity(resp.data.status);
        setMessage(resp.data.message);
      })
      .catch((err) => {
        setOpen(true);
        setSeverity("error");
        setMessage("Something went wrong");
        return;
      });
    props.updateCartCount();
  };

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  return (
    <div>
      <Card
        sx={{ maxWidth: 345, maxHeight : 500, minHeight : 400 }}
        style={{
          margin: "10px",
        }}
      >
        <CardMedia
          component="img"
          alt={props.name}
          height="140"
          image={props.img}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.changeToRightCase(props.name.split(" "))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>
              {props.changeToRightCase(props.pharmacy.split(" "))}
            </strong>
            <div>
              Company : {props.changeToRightCase(props.content.split(" "))}
            </div>
            <strong> MRP :</strong> ₹{props.mrp} <br />
            <strong>Order At :</strong> ₹{props.rate}
          </Typography>
        </CardContent>
        <CardActions>
          <Button style={{ color: "purple" }} onClick={(e) => addToCart(e)}>
            ADD TO CART
          </Button>
          {/* <Button size="small">Learn More</Button> */}
        </CardActions>
      </Card>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
