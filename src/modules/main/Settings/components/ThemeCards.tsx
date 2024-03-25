import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import axios from "../../../../api/axios";

export default function ThemeCards({ theme, appTheme, setOpen, setSeverity, setMessage }) {
    const setTheme = () => {
        axios.post("/set-theme", { id : theme.id }).then((res) => {
            setOpen(true);
            setSeverity(res.data.status);
            setMessage(res.data.message);
            if(res.data.status == "success") {
                setTimeout(() => {  
                    window.location.reload();
                }, 3000);
            }
        });
    }
    return (
        <Card sx={{ width: 350, margin: "20px", backgroundColor: appTheme.background, color: appTheme.fontColor }}>
            <div style={{ display: "flex", alignItems: "center", height: "100px" }}>
                <div style={{backgroundColor: theme.background, height: "100%", width: "100%" }}></div>
                <div style={{backgroundColor: theme.fontColor, height: "100%",width: "100%" }}></div>
                <div style={{backgroundColor: theme.others, height: "100%", width: "100%"}}></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", height: "20px", marginTop: "5px" }}>
                <div style={{height: "100%", width: "100%" }}>Background</div>
                <div style={{height: "100%",width: "100%" }}>Font Color</div>
                <div style={{height: "100%", width: "100%"}}>Others</div>
            </div>
            <CardContent>
                <strong>{theme.name[0].toUpperCase() + theme.name.substring(1) + " Theme"}</strong>
            </CardContent>
                <Button
                    style={{
                        width: "95%",
                        backgroundColor: appTheme.others,
                        color: "white",
                        margin: "5px"
                    }}
                    onClick={setTheme}
                >
                        Use this Theme
                </Button>
        </Card>
    );
}