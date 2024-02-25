import React, { useState } from "react";
import { MDBCardImage } from "mdb-react-ui-kit";
import medImg from "../../assets/medicine-img.png";

function CartImage(props) {
    const [imageError, setImageError] = useState(false);
    return(
    <MDBCardImage
      style={{ marginLeft: "20px" }}
      fluid
      src={imageError ? medImg : process.env.REACT_APP_BASE_URL + "/medicine-image?mid=" + props.mid}
      alt="Generic placeholder image"
      onError={() => setImageError(true)}
    />);
  }

  export default CartImage;