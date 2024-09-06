import React from "react";
import Sidebar from "../../components/Sidebar";
import DashboardDoctorHeader from "../../components/MainHeader/DashboardDoctorHeader";
import { useNavigate } from "react-router-dom";

const DoctorCreateProfile2 = () => {
  const navigate = useNavigate();
  return (
    <div className="doctormain">
      <Sidebar />
      <div className="rightSec">
        <DashboardDoctorHeader />
        <div className="CompleteProfileMain">
          <div className="CompleteProfileBox">
            <h3>Create a profile to get started.</h3>
            <h4>Create a profile initially to proceed further.</h4>
            <button className="dashboardBtn" onClick={() => navigate('/doctor/profile')}>Complete my Profile</button>
          </div>
          {/* <div className="CompleteProfileBox">
            <h3>
              Thanks <strong>Dr. Jonathon!</strong>
              <br />
              for completed this form
            </h3>
            <button className="GoProfiledBtn">Go to profile</button>
            <button className="dashboardBtn">Go to dashboard</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DoctorCreateProfile2;
