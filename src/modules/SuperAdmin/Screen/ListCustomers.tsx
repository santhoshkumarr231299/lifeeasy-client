import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import Cookies from 'js-cookie';

interface customer {
    username : string,
    role : Number,
    mobileNumber : string,
    email : string,
    pharmacyName : string,
    branchId : Number,
    subscriptionPack : string,
    dateOfSubscription : string,
}

function ListCustomers() {
    const [customers, setCustomers] = useState<customer[]>([]);

    const fetchCustomers = () : void  => {
        axios.post("/get-all-customers", {
            secretKey : Cookies.get("secretKey")
        }).then((resp) => {
            setCustomers(resp.data);
        })
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (<div className="super-admin-customers">
        
    </div>)
}

export default ListCustomers;