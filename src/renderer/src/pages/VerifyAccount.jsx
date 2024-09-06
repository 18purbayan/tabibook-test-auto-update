import React, {useEffect, useState} from "react";
import Mainheader from "../components/MainHeader/Mainheader";
import {useNavigate, useParams} from "react-router-dom";
import Tick from "../assets/images/tick.svg";
import {activateAccountApi} from "../services/apiService";
import {toast} from "react-toastify";

const VerifyAccount = () => {
  const navigate = useNavigate();
  const {token} = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    navigate("/patient/login");
  };

  const activateAccount = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("token", token);
      let response = await activateAccountApi(formData);
      if (response) {
        if (response.data.res === true) {
          setError(false);
        } else {
          toast.error(response.data.msg, {autoClose: 1500});
          setError(true);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Something went wrong in server. Please try again.", {autoClose: 1500});
    }
  };

  useEffect(() => {
    activateAccount();
  }, []);

  return (
    <div className="Main">
      {/* <Mainheader /> */}
      <div className="Fullbody">
        <div className="ConfirmBox">
          {!loading ? (
            <>
              <h3>Verify Account</h3>
              {!error ? (
                <>
                  <h4>Congratulations!</h4>
                  <h5>
                    Your email has been verified successfully. Thank you for completing the verification process. You can now continue to use our services
                    without any interruptions.
                  </h5>

                  <div className="tick">
                    <img src={Tick} className="MainLogo" alt="logo" />
                  </div>

                  <button type="submit" className="login-button" onClick={handleLogin}>
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <h4>Oops!</h4>
                  <h5>We were unable to verify your email address.</h5>
                  <button type="submit" className="login-button" onClick={() => navigate("/")}>
                    Continue
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <h3>Verify Account</h3>
              <h5>Please wait for a moment...</h5>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
