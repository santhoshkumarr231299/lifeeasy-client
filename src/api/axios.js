import axios from "axios";
import Cookies from "js-cookie";

function getCookie() {
    return Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY);
}

export default axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    headers: {
        authorization : getCookie(),
    }
})