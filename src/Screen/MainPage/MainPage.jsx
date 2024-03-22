import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../api/axios";
import ListGroup from "react-bootstrap/ListGroup";
import LogoutPage from "../LogoutPage/LogoutPage";
import Navbar from "./Navbar";
import { getMenuIcon, contentArea } from "../../modules/data/menu-data.tsx";



function MainPage({ theme }) {
  document.title = process.env.REACT_APP_PRODUCT_FIRST_NAME + process.env.REACT_APP_PRODUCT_LAST_NAME + " - Home";
  const [option, setOption] = useState(0);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [menus, setMenus] = useState([]);

  const handleCloseLogout = () => {
    setLogout(false);
  };
  const handleOpenLogout = () => {
    setLogout(true);
  };

  const removeCookieAndReload = () => {
    try {
      Cookies.remove(process.env.REACT_APP_SECRET_COOKIE_KEY);
    } catch (e) {
      //
    } finally {
      localStorage.removeItem(process.env.REACT_APP_LOCALSTORAGE_USER_LOGIN_STATUS);
    }
    window.location.reload();
  }

  const getMenus = () => {
    axios.get("/menus").then((res) => {
      setMenus(() => []);
      if(res.data.status == 'success') {
        res.data.data.forEach((menu) => {
          setMenus((prev) => [...prev, {
            menuValue : menu.menuId,
            name : menu.menuName,
            icon : getMenuIcon(menu.menuId),
          }])
        })
      }
    })
  }

  useEffect(() => {
    axios.post("/logged-in").then((res) => {
      if (!res.data.username || res.data.username == "") {
        removeCookieAndReload();
        // navigate("/login");
      } else {
        getMenus();
        if(res.data?.isTFAEnabled && !res.data?.isTFAVerified) {
          navigate("/authenticate");
        }
        setOption(() => res.data.lastAccessedScreen);
        setUser({
          username: res.data.username,
          role: res.data.role,
          lastAccessedScreen: res.data.lastAccessedScreen,
          pharmacy: res.data.pharmacy,
        });
        setOption(res.data.lastAccessedScreen);
        let today = new Date();
        let DateOfSubscription = new Date(res.data.DateOfSubscription);
        console.log(
          "remaining days : ",
          (today - DateOfSubscription) / (1000 * 60 * 60 * 24)
        );
        if (res.data.pharmacy == "") {
          // navigate("/home");
        } else if (
          res.data.subscriptionPack == "monthly" &&
          (today - DateOfSubscription) / (1000 * 60 * 60 * 24) <= 30
        ) {
          // navigate("/home");
        } else if (
          res.data.subscriptionPack == "yearly" &&
          (today - DateOfSubscription) / (1000 * 60 * 60 * 24) <= 365
        ) {
          // navigate("/home");
        } else {
          navigate("/subscribe");
        }
      }
    }).catch(error => {
      if(error.code == 'ERR_NETWORK') {
        removeCookieAndReload();
      }
    });
  }, []);
  const changeOption = (e, value) => {
    e.preventDefault();
    if (value === 1000) {
      handleOpenLogout();
      return;
    }
    setOption(value);
    updateLastAccessedScreen(e, value);
  };
  const updateLastAccessedScreen = (e, value) => {
    e.preventDefault();
    if (value === 1000) {
      return;
    }

    axios
      .post("/update-last-accessed", {
        username: user.username,
        role: user.role,
        lastAccessedScreen: value,
      })
      .then((resp) => {
        //
      });
  };
  return (
    <div>
      <div className="sticky-pharm">
        <Navbar
          pharmacy={user ? (user.pharmacy ? user.pharmacy : " ") : " "}
          username={user ? (user.username ? user.username : " ") : " "}
          theme={theme}
          changeOption={changeOption}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "2rem",
        }}
      >
        <div className="sticky-pharm-sidebar">
          <ListGroup
            style={{
              marginTop: "30px",
              boxShadow: "0 2px 5px rgb(0 0 0 / 0.2)",
            }}
          >
            {menus.map(
              (menu) =>
                (
                  <ListGroup.Item
                    key={menu.menuValue}
                    className="sidebar-items"
                    style={{
                      width: "280px",
                      color: option === menu.menuValue ? "purple" : "",
                      fontWeight: option === menu.menuValue ? "bold" : "",
                    }}
                  >
                    <a
                      key={menu.menuValue}
                      style={{
                        display: "flex",
                        gap: "10px",
                        margin: "8px 0 8px 0",
                      }}
                      onClick={(e) => changeOption(e, menu.menuValue)}
                    >
                      <div>{menu.icon}</div>
                      <div>
                        <span>{menu.name}</span>
                      </div>
                    </a>
                  </ListGroup.Item>
                )
            )}
          </ListGroup>
        </div>
        <div>
          <main
            style={{
              marginTop: "10px",
              marginLeft: "300px",
              padding: "20px 0 25px 20px",
            }}
            className="content"
          >
            {contentArea(option, user, theme)}
          </main>
        </div>
        {/* <div style={{backgroundColor : 'white', marginTop : '30px', borderRadius : '5px', maxHeight : "600px", width : "400px", boxShadow: "0 2px 5px rgb(0 0 0 / 0.2)",}}>
            
        </div> */}
      </div>
      {/* <div style={{backgroundColor : 'white', borderRadius : '5px', height : "200px", width : "97%", marginLeft : "21px", boxShadow: "0 2px 5px rgb(0 0 0 / 0.2)",}}>
            
      </div> */}
      {logout && (
        <LogoutPage open={handleOpenLogout} close={handleCloseLogout} />
      )}
    </div>
  );
}

export default MainPage;
