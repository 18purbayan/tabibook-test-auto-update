import React from "react";
import {Routes, Route} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword";
import Register from "./pages/Register";
import PasswordSaved from "./pages/PasswordSaved";
import Varification from "./pages/Varification";
import VarificationCode from "./pages/VarificationCode";
import Confirmation from "./pages/Confirmation";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import MyAccount from "./pages/MyAccount";
import Auth from "./ProtectedRoutes/Auth";
import MyAppointmentsNotSelected from "./pages/patient/my-appointments-not-selected";
import MyAppointment from "./pages/patient/my-appointments-upcoming";
import MyAppointment2 from "./pages/patient/my-appointments-rescheduled";
import MyAppointment3 from "./pages/patient/my-appointments-canceled-by-doctor";
import MyAppointment4 from "./pages/patient/my-appointments-patient-not-attended";
import MyAppointments5 from "./pages/patient/my-appointments-doctor-absent";
import MyAppointment6 from "./pages/patient/my-appointments-completed";
import DoctorLanding from "./pages/doctor/DoctorLanding";
import Approval from "./pages/doctor/Approval";
import DoctorLogin from "./pages/doctor/DoctorLogin";
import ConfirmationAdmin from "./pages/doctor/ConfirmationAdmin";
import Dashboard from "./pages/doctor/dashboard";
import SetAvailability from "./pages/doctor/set-availability";
import "react-loading-skeleton/dist/skeleton.css";
import Appointments from "./pages/doctor/appointments";
import DoctorCreactProfile from "./pages/doctor/doctor-creact-profile";
import Nurse from "./pages/nurse/nurses";
import DoctorCreateProfile2 from "./pages/doctor/doctor-create-profile2";
import IncompleteDocProAuth from "./ProtectedRoutes/IncompleteDocProAuth";
import BookingStep2 from "./pages/patient/bookingStep2";
import BookAppointment from "./pages/patient/bookAppointment";
import BookingConfirm from "./pages/patient/bookingConfirm";
import DoctorMyAccount from "./pages/doctor/doctor-my-account";
import VerifyAccount from "./pages/VerifyAccount";
import SearchListing from "./pages/SearchListing";
import DoctorDetails from "./pages/doctor/DoctorDetails";
import DoctorDetailsFromPatient from "./pages/DoctorDetailsFromPatient";
import ConsultationObservations from "./pages/doctor/consultation-observations";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/welcome" exact element={<Welcome />} />
        <Route path="/patient/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/setpassword/:id" element={<SetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/savedpassword" element={<PasswordSaved />} />
        <Route path="/verification" element={<Varification />} />
        <Route path="/verificationcode" element={<VarificationCode />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/confirm-account/:token" element={<VerifyAccount />} />
        <Route path="/search-listing" element={<SearchListing />} />
        <Route path="/search/doctor-details/:slug" element={<DoctorDetailsFromPatient />} />

        {/* Role for Patient */}
        <Route element={<Auth allowedRoles={["Patient"]} />}>
          <Route path="/my-profile" element={<MyAccount />} />
          {/* patientnanai */}
          <Route path="/my-appointments-not-selected" element={<MyAppointmentsNotSelected />} />
          <Route path="/my-appointments" element={<MyAppointment />} />
          <Route path="/my-appointments-rescheduled" element={<MyAppointment2 />} />
          <Route path="/my-appointments-canceled-by-doctor" element={<MyAppointment3 />} />
          <Route path="/my-appointments-patient-not-attended" element={<MyAppointment4 />} />
          <Route path="/my-appointments-doctor-absent" element={<MyAppointments5 />} />
          <Route path="/my-appointments-completed" element={<MyAppointment6 />} />
          <Route path="/appointment-booking" element={<BookAppointment />} />
          <Route path="/appointment-booking/confirm" element={<BookingConfirm />} />
          {/* patientnanai */}
        </Route>

        {/* Doctor */}
        <Route path="/doctor/home" element={<DoctorLanding />} />
        <Route path="/doctor/approval" element={<Approval />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />

        <Route element={<Auth allowedRoles={["Doctor"]} />}>
          <Route path="/doctor/confirmation" element={<ConfirmationAdmin />} />
          <Route path="/doctor/incomplete-profile" element={<DoctorCreateProfile2 />} />
          <Route path="/doctor/profile" element={<DoctorCreactProfile />} />
          <Route path="/doctor/account" element={<DoctorMyAccount />} />
          <Route element={<IncompleteDocProAuth allowedRoles={["Doctor"]} />}>
            <Route path="/doctor/dashboard" element={<Dashboard />} />
            <Route path="/doctor/availability" element={<SetAvailability />} />
            <Route path="/doctor/appointments" element={<Appointments />} />
            <Route path="/doctor/nurses" element={<Nurse />} />
            <Route path="/doctor/profile/view" element={<DoctorDetails />} />
            <Route path="/doctor/appointment-details/:appId" element={<ConsultationObservations />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
