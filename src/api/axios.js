import axios from "axios";
import Cookies from "js-cookie";

function getCookie() {
    return Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY);
}
function getNewUserAuth() {
    return Cookies.get(process.env.REACT_APP_SECRET_NEW_USER_AUTH_KEY);
}

export default axios.create({
    baseURL : process.env.REACT_APP_BASE_URL,
    headers: {
        authorization : getCookie(),
        newUserAuth: getNewUserAuth()
        
    }
})