import axios from "../../../api/axios";
import React, { useState } from "react";
import { Paper, Button, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ThemeCards from "./components/ThemeCards.tsx";

interface themeType {
  id : number,
  name : string,
  background : string,
  fontColor : string,
  others : string
}

export default function ThemeSettings({ theme }) {
  const [option, setOption] = useState<number>(0);
  const [themes, setThemes] = useState<themeType[]>([]);
  const settings = () => {
      switch (option) {
        case 1:
          return <Themes themes={themes} appTheme={theme}/>;
        default:
          return <CircularProgress />
      }
  };

  const getThemes = () => {
    axios.get("/get-themes").then((res) => {
      setOption(1);
      setThemes(res.data.data);
    })
  } 

  useEffect(() => {
    getThemes();
  }, []);
  return (
    <div>
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          alignSelf: "center",
          margin: "auto",
          backgroundColor: theme.background,
          width: "1560px",
          height: "810px",
        }}
      >
       <div style={{
        padding : "30px"
       }}>
        <h3>
          Choose Theme
        </h3>
          {/* <Button
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              margin: "15px",
              right: -400,
              backgroundColor: theme.others,
            }}
            variant="contained"
            onClick={(e) => option == 2 ? setOption(1) : setOption(2)}
          >
            {option == 1 ? "Back" : "Change Password"}
          </Button> */}
       </div>
        {settings()}
      </Paper>
    </div>
  );
}

function Themes({ themes, appTheme }) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  
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
      <div 
        style={{ 
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        }}
      >
        {themes.map((theme: themeType) => (
          <div key={theme.id}>
            <ThemeCards theme={theme} appTheme={appTheme} setOpen={setOpen} setSeverity={setSeverity} setMessage={setMessage} />
          </div>
        ))}
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
