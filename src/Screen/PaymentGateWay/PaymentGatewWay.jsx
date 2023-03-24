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

async function displayRazorpay(makeOrder) {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const result = await axios.post("/payment/orders", {
    secretKey: Cookies.get("secretKey"),
  });

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

      const result = await axios.post("/payment/success", data);

      // alert(result.data.message);
      const res = await makeOrder();

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

export async function RazorpayPaymentGateWay(makeOrder) {
  return await displayRazorpay(makeOrder);
}
