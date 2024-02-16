import React, { Suspense, lazy } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";
import ListGroup from "react-bootstrap/ListGroup";
import LogoutPage from "../LogoutPage/LogoutPage";
import Navbar from "./Navbar";
import {
  Dashboard,
  Receipt,
  Vaccines,
  LocalPharmacy,
  Flag,
  ShoppingBasket,
  People,
  DeliveryDining,
  AttachMoney,
  AdminPanelSettings,
  CheckCircle,
  LocalHospital,
  ContactMail,
} from "@mui/icons-material";

const DashboardPage = lazy(() => import("../Dashboard/Dashboard"));
const Invoice = lazy(() => import("../Invoice/NewInvoice"));
const Manager = lazy(() => import("../Manager/Manager"));
const MedicinePage = lazy(() => import("../Medicine/MedicinePage"));
const PharmacistPage = lazy(() => import("../Pharmacist/PharmacistPage"));
const ReportsPage = lazy(() => import("../ReportsPage/ReportsPage"));
const DeliveryMenPage = lazy(() =>
  import("../DelvieryMenPage/DeliveryMenPage")
);
const SalesReportsPage = lazy(() => import("../SalesReport/SalesReportPage"));
const PurchasePage = lazy(() => import("../PurchasePage/PurchasePage"));
const SettingsPage = lazy(() => import("../SettingsPage/Settings"));
const PharmacistApprovalPage = lazy(() =>
  import("../PharmacistApprovalPage/PharmacistApprovalPage")
);
const AssignUserPrevilegesPage = lazy(() =>
  import("../AssignUserPrevileges/AssignUserPrevileges")
);
const OrderPickupPage = lazy(() => import("../DelvieryMenPage/OrderPickup"));
const SearchMedicines = lazy(() =>
  import("../../modules/customer/SearchMedicines.tsx")
);
const ChatWithOrganization = lazy(() => import("../../modules/chatWithOrg/ChatWithOrganization.tsx"));

function MainPage(props) {
  document.title = process.env.REACT_APP_PRODUCT_FIRST_NAME + process.env.REACT_APP_PRODUCT_LAST_NAME + " - Home";
  const [option, setOption] = useState(0);
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);

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

  useEffect(() => {
    axios.post("/logged-in").then((res) => {
      if (!res.data.username || res.data.username == "") {
        removeCookieAndReload();
        // navigate("/login");
      } else {
        setOption(() => res.data.lastAccessedScreen);
        setUser({
          username: res.data.username,
          role: res.data.role,
          lastAccessedScreen: res.data.lastAccessedScreen,
          haveAccessTo: res.data.haveAccessTo,
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
        secretKey: Cookies.get(process.env.REACT_APP_SECRET_COOKIE_KEY),
      })
      .then((resp) => {
        //
      });
  };
  const menus = [
    {
      name: "Dashboard",
      menuValue: 1,
      icon: <Dashboard />,
      haveAccess: user && user.haveAccessTo.includes("[1]"),
    },
    {
      name: "Invoice",
      menuValue: 2,
      icon: <Receipt />,
      haveAccess: user && user.haveAccessTo.includes("[2]"),
    },
    {
      name: "Manager",
      menuValue: 3,
      icon: <People />,
      haveAccess: user && user.haveAccessTo.includes("[3]"),
    },
    {
      name: "Medicine",
      menuValue: 4,
      icon: <Vaccines />,
      haveAccess: user && user.haveAccessTo.includes("[4]"),
    },
    {
      name: "Pharmacist",
      menuValue: 5,
      icon: <LocalPharmacy />,
      haveAccess: user && user.haveAccessTo.includes("[5]"),
    },
    {
      name: "Delivery Men",
      menuValue: 6,
      icon: <DeliveryDining />,
      haveAccess: user && user.haveAccessTo.includes("[6]"),
    },
    {
      name: "Sales Report",
      menuValue: 7,
      icon: <AttachMoney />,
      haveAccess: user && user.haveAccessTo.includes("[7]"),
    },
    {
      name: "Purchase",
      menuValue: 8,
      icon: <ShoppingBasket />,
      haveAccess: user && user.haveAccessTo.includes("[8]"),
    },
    {
      name: "Reports",
      menuValue: 9,
      icon: <Flag />,
      haveAccess: user && user.haveAccessTo.includes("[9]"),
    },
    {
      name: "Manage User Previleges",
      menuValue: 10,
      icon: <AdminPanelSettings />,
      haveAccess: user && user.haveAccessTo.includes("[10]"),
    },
    {
      name: "Orders Approval",
      menuValue: 11,
      icon: <CheckCircle />,
      haveAccess: user && user.haveAccessTo.includes("[11]"),
    },
    {
      name: "Orders Pickup",
      menuValue: 12,
      icon: <CheckCircle />,
      haveAccess: user && user.haveAccessTo.includes("[12]"),
    },
    {
      name: "Medicine Details",
      menuValue: 13,
      icon: <LocalHospital />,
      haveAccess: user && user.haveAccessTo.includes("[8]"),
    },
    {
      name: "Chat with Organization",
      menuValue: 14,
      icon: <ContactMail />,
      haveAccess: true,
    },
  ];

  const contentArea = () => {
    switch (option) {
      case 1:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <DashboardPage />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <Invoice />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <Manager />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <MedicinePage />
          </Suspense>
        );
      case 5:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <PharmacistPage />
          </Suspense>
        );
      case 6:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <DeliveryMenPage />
          </Suspense>
        );
      case 7:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <SalesReportsPage />
          </Suspense>
        );
      case 8:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <PurchasePage username={user.username} />
          </Suspense>
        );
      case 9:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <ReportsPage />
          </Suspense>
        );
      case 10:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <AssignUserPrevilegesPage />
          </Suspense>
        );
      case 11:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <PharmacistApprovalPage />
          </Suspense>
        );
      case 12:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <OrderPickupPage />
          </Suspense>
        );
      case 13:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <SearchMedicines />
          </Suspense>
        );
      case 14:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <ChatWithOrganization />
          </Suspense>
        );
      case 999:
        return (
          <Suspense fallback={<CircularProgress size={50} />}>
            <SettingsPage username={user.username} />
          </Suspense>
        );
      default:
        return;
    }
  };
  return (
    <div>
      <div className="sticky-pharm">
        <Navbar
          pharmacy={user ? (user.pharmacy ? user.pharmacy : " ") : " "}
          username={user ? (user.username ? user.username : " ") : " "}
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
                menu.haveAccess && (
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
            {contentArea()}
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
