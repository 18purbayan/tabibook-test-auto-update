import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingPage = () => {
  return (
    <div className="loader-container">
      <Backdrop sx={{color: "#010a41"}} open={true}>
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
    </div>
  );
};

export default LoadingPage;
