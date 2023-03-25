import axios from "../../api/axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Form } from "react-bootstrap";
import { Paper, Button, CircularProgress } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Typeahead } from "react-bootstrap-typeahead";
import Cookies from "js-cookie";

export default function AssignUserPrevilegesPage(props) {
  return (
    <div>
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          alignSelf: "center",
          margin: "auto",
          backgroundColor: "white",
          width: "1135px",
          height: "600px",
          color: "Black",
        }}
      >
        <AssignUserPrevileges />
      </Paper>
    </div>
  );
}

function AssignUserPrevileges(props) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const handleClose = () => {
    setMessage("");
    setSeverity("success");
    setOpen(false);
  };
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [selectedUser, setSelectedUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [usePrevileges, setUserPrevileges] = useState("");

  const allMenus = [
    {
      id: 1,
      FieldId: "[1]",
      FieldName: "Dashboard",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[1]"),
      disabled: false,
    },
    {
      id: 2,
      FieldId: "[2]",
      FieldName: "Invoice",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[2]"),
      disabled: false,
    },
    {
      id: 3,
      FieldId: "[3]",
      FieldName: "Customer",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[3]"),
      disabled: false,
    },
    {
      id: 4,
      FieldId: "[4]",
      FieldName: "Medicine",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[4]"),
      disabled: false,
    },
    {
      id: 5,
      FieldId: "[5]",
      FieldName: "Pharmacist",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[5]"),
      disabled: false,
    },
    {
      id: 6,
      FieldId: "[6]",
      FieldName: "Delivery Man",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[6]"),
      disabled: false,
    },
    {
      id: 7,
      FieldId: "[7]",
      FieldName: "Sales Report",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[7]"),
      disabled: false,
    },
    // {
    //   FieldId: "[8]",
    //   FieldName: "Purchase",
    //   FieldType: "checkbox",
    //   isChecked: usePrevileges && usePrevileges.includes("[8]"),
    //   disabled: false,
    // },
    {
      id: 9,
      FieldId: "[9]",
      FieldName: "Reports",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[9]"),
      disabled: false,
    },
    {
      id: 11,
      FieldId: "[11]",
      FieldName: "Orders Approval",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[11]"),
      disabled: true,
    },
    {
      id: 12,
      FieldId: "[12]",
      FieldName: "Orders Pickup",
      FieldType: "checkbox",
      isChecked: usePrevileges && usePrevileges.includes("[12]"),
      disabled: true,
    },
  ];
  const changeOption = (e, id) => {
    if (!e.target.checked) {
      setUserPrevileges(() => usePrevileges.replace(id, ""));
    } else {
      setUserPrevileges(() => usePrevileges + id);
    }
  };

  const fetchUserPrevileges = async () => {
    let userPrevileges = "";
    allMenus.forEach((menu) => {
      if (menu.isChecked) {
        userPrevileges += menu.FieldId;
      }
    });
    return userPrevileges;
  };

  const updatePrevileges = async (e) => {
    e.preventDefault();
    setIsBtnDisabled(true);
    let userPrevileges = await fetchUserPrevileges();
    if (userPrevileges === "") {
      setSeverity("warning");
      setMessage("Choose atleast one User Previleges");
      setOpen(true);
      setIsBtnDisabled(false);
      return;
    }
    let userPreTemp = await userPrevileges.replace("[", "");
    userPreTemp = await userPreTemp.replace("]", " ");
    let userPreArr = await userPreTemp.split(" ");
    axios
      .post("/update-user-previleges", {
        username: selectedUser[0].label,
        userPrevileges: userPrevileges,
        lastAccessedScreen: userPreArr[0],
        secretKey: Cookies.get("secretKey"),
      })
      .then((resp) => {
        setSeverity(resp.data.status);
        setMessage(resp.data.message);
        setOpen(true);
        setIsBtnDisabled(false);
      })
      .catch((err) => {
        setSeverity("error");
        setMessage("Something went wrong");
        setOpen(true);
        setIsBtnDisabled(false);
      });
  };

  useEffect(() => {
    axios
      .post("/get-users", {
        search: "",
        secretKey: Cookies.get("secretKey"),
      })
      .then((resp) => {
        let userOpt = [];
        resp.data.users.forEach((user) => {
          userOpt.push({ label: user.username });
        });
        setUsers(userOpt);
      })
      .catch((err) => {
        setSeverity("error");
        setMessage("Something went wrong");
        setOpen(true);
      });
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser.length === 1) {
      setIsLoading(true);
      axios
        .post("/get-user-previleges", {
          username: selectedUser[0].label,
          secretKey: Cookies.get("secretKey"),
        })
        .then((resp) => {
          setUserPrevileges(resp.data.userPrevileges);
          setIsLoading(false);
        })
        .catch((err) => {
          setSeverity("error");
          setMessage("Something went wrong");
          setOpen(true);
          setIsLoading(false);
        });
    } else {
      setUserPrevileges("");
      setIsLoading(false);
    }
  }, [selectedUser]);

  return (
    <div>
      <Form>
        <Form.Group
          style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}
        >
          <Typeahead
            id="typeahead"
            labelKey="label"
            onChange={setSelectedUser}
            options={users}
            placeholder="Select a User..."
            selected={selectedUser}
          />
        </Form.Group>
        <div
          style={{
            margin: "10px",
            display: "flex",
            gap: "5px",
            margin: "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <h6 style={{ margin: 0, padding: 0 }}>SELECTED USER : </h6>
          </div>
          <div style={{ textDecorationLine: "underline", color: "purple" }}>
            {selectedUser && selectedUser.length === 1
              ? selectedUser[0].label
              : "none"}
          </div>
        </div>
        <div
          style={{
            padding: "20px",
            width: "200px",
            margin: "auto",
            textAlign: "left",
            display: selectedUser && selectedUser === "" ? "none" : "block",
          }}
        >
          {isLoading ? (<div style={{
            marginLeft : "65px"
          }}><CircularProgress style={{ marginRight: "10px" }} size={20} /> </div>) :
          selectedUser.length > 0 &&
            allMenus.map((menu) => (
              <div key={menu.FieldId}>
                <Form.Check
                  id={menu.FieldName}
                  onChange={(e) => changeOption(e, menu.FieldId)}
                  type={menu.FieldType}
                  label={menu.FieldName}
                  checked={menu.isChecked}
                  disabled={menu.disabled}
                />
              </div>
            ))}
        </div>
      </Form>
      <Button
        style={{
          marginBottom: "20px",
          marginTop: "10px",
          backgroundColor: "purple",
        }}
        variant="contained"
        onClick={(e) => updatePrevileges(e)}
        disabled={isBtnDisabled}
      >
        {isBtnDisabled && (<CircularProgress style={{ marginRight: "10px" }} size={20} />)}
        Save Previleges
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
