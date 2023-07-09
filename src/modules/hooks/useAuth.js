import { useState } from "react";
import axios from "../../api/axios";

async function useAuth() {
    const [user, setUser] = useState("");
    await axios.post("/logged-in").then((resp) => {
        if (resp.data.username !== "") {
            setUser(resp.data.username);    
            // let today = new Date();
            // let DateOfSubscription = new Date(res.data.DateOfSubscription);
            // console.log('remaining days : ',((today - DateOfSubscription)/(1000*60*60*24)));
            // if(resp.data.pharmacy == "") {
            //   // navigate("/home");
            // } else if(resp.data.subscriptionPack == 'monthly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 30)) {
            //   // navigate("/home");
            // } else if(resp.data.subscriptionPack == 'yearly' && ((today - DateOfSubscription)/(1000*60*60*24) <= 365)) {
            //   // navigate("/home");
            // } else {
            //   // navigate("/subscribe");
            // }
          }
    })
    return [user, setUser];
}

export { useAuth };