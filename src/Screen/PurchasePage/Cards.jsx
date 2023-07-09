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
        quantity: 1,
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
        sx={{ maxWidth: 500 }}
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
        <CardContent sx={{ height: 150 }}>
          <Typography gutterBottom variant="h6" component="div">
            {props.changeToRightCase(props.name.split(" "))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>
              {props.changeToRightCase(props.pharmacy.split(" "))}
            </strong>
            <div>
              <strong>Company :</strong>{" "}
              {props.changeToRightCase(props.content.split(" "))}
            </div>
          </Typography>
        </CardContent>
        <Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginLeft: "20px",
            }}
          >
            <span style={{ textDecoration: "line-through", fontSize: "30px" }}>
              ₹{props.mrp}{" "}
            </span>{" "}
            <span style={{ fontSize: "20px" }}>₹{props.rate}</span>
          </div>
        </Typography>
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
