import axios from "../../api/axios";
import Cookies from "js-cookie";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

async function displayRazorpay(openSnackBar, setIsLoading, refreshCartItems) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const result = await axios.post("/payment/orders");

  if (!result) {
    alert("Server error. Are you online?");
    return;
  }

  const {
    amount,
    id: order_id,
    currency,
    // username,
    // email,
    // mobileNumber,
  } = result.data;

  const options = {
    key: process.env.REACT_APP_RAZORPAY_PAYMENT_KEY_ID,
    amount: amount.toString(),
    currency: currency,
    name: "PharmSimple",
    description: "Test Transaction",
    order_id: order_id,
    handler: async function (response) {
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      };

      const res = await axios.post("/payment/success", data);

      if(res.data.status == "success") openSnackBar("success", res.data.message);
      else openSnackBar("error", res.data.message);
      setIsLoading(false);
      refreshCartItems();
      return;
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    notes: {
      address: "",
    },
    theme: {
      color: "#763568",
    },
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

export async function RazorpayPaymentGateWay(openSnackBar, setIsLoading, refreshCartItems) {
  return await displayRazorpay(openSnackBar, setIsLoading, refreshCartItems);
}

export async function RazorpayPaymentGateWaySubscription(openSnackBar, subscriptionType, goToHome) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const result = await axios.post("/payment/subscription", {
    subscriptionType : subscriptionType
  });

  if (!result) {
    alert("Server error. Are you online?");
    return;
  }

  const {
    amount,
    id: order_id,
    currency,
  } = result.data;

  const options = {
    key: process.env.REACT_APP_RAZORPAY_PAYMENT_KEY_ID,
    amount: amount.toString(),
    currency: currency,
    name: "PharmSimple",
    description: "Test Transaction",
    order_id: order_id,
    handler: async function (response) {
      const data = {
        orderCreationId: order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        subscriptionType : subscriptionType
      };

      const result = await axios.post("/payment/subscription/success", data);
      
      if(result.data.status === 'success') {
        openSnackBar("success", result.data.message);
      } else {
        openSnackBar("error", result.data.message);
      }

      setTimeout(() => {
        goToHome();
      }, 2000);

      return;
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    notes: {
      address: "",
    },
    theme: {
      color: "#763568",
    },
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}


export async function activateYourFreeTrail(openSnackBar, goToHome) {
  const res = await axios.post("/activate-free-trial");
  if(res.data.status === 'success') {
    openSnackBar("success", res.data.message);
    setTimeout(() => {
      goToHome();
    }, 2000);
  } else {
    openSnackBar("error", res.data.message);
  }
  return;
}