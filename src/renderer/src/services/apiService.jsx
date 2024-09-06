import {API_BASE_URL} from "../app_url";
import axios from "axios";

const getHeader = () => {
  let value = JSON.parse(localStorage.getItem("tabsbookLoginInfo"));
  let header = {
    headers: {
      Authorization: "Bearer " + value.authorisation.token,
    },
  };
  return header;
};

export const cityListApi = values => {
  return axios.post(API_BASE_URL + `patient/cityList`, values);
};

export const signUpApi = values => {
  return axios.post(API_BASE_URL + `patient/sign-up`, values);
};

export const forgotPasswordApi = values => {
  return axios.post(API_BASE_URL + `patient/forgot-password`, values);
};

export const updatePasswordApi = values => {
  return axios.post(API_BASE_URL + `patient/update-password`, values);
};

export const signUpSendVerificationMessageApi = values => {
  return axios.post(API_BASE_URL + `patient/signUpSendVerificationMessage`, values);
};

export const signUpVerifyAccountApi = values => {
  return axios.post(API_BASE_URL + `patient/signUpVerifyAccount`, values);
};

export const loginApi = values => {
  return axios.post(API_BASE_URL + `patient/login`, values);
};

export const myAccountDetailsApi = () => {
  return axios.post(API_BASE_URL + `patient/MyAccountDetails`, {}, getHeader());
};

export const updateProfilePictureApi = values => {
  return axios.post(API_BASE_URL + `patient/updateProfilePicture`, values, getHeader());
};

export const removeProfilePictureApi = values => {
  return axios.post(API_BASE_URL + `patient/removeProfilePicture`, {}, getHeader());
};

export const updateMyAccountApi = values => {
  return axios.post(API_BASE_URL + `patient/updateMyAccount`, values, getHeader());
};

export const changePasswordApi = values => {
  return axios.post(API_BASE_URL + `patient/change-password`, values, getHeader());
};

export const updateOtpApi = values => {
  return axios.post(API_BASE_URL + `patient/sendPhoneUpdateRequest`, values, getHeader());
};

export const updatePhoneNumberApi = values => {
  return axios.post(API_BASE_URL + `patient/updatePhoneNumber`, values, getHeader());
};

export const updateShowPhoneNumberApi = values => {
  return axios.post(API_BASE_URL + `patient/showPhoneNumberToDoctor`, values, getHeader());
};

export const getSpecialityApi = () => {
  return axios.get(API_BASE_URL + `home/get-speciality`);
};

export const requestDoctorApi = values => {
  return axios.post(API_BASE_URL + `home/request-doctor`, values);
};

export const doctorLoginApi = values => {
  return axios.post(API_BASE_URL + `user/login`, values);
};

export const fetchNormalAvailabilityApi = () => {
  return axios.get(API_BASE_URL + `doctor/fetch-normal-availability`, getHeader());
};

export const deleteNormalAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `doctor/delete-normal-availability`, values, getHeader());
};

export const addNormalAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `doctor/add-normal-availability`, values, getHeader());
};

export const addDateAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `doctor/add-date-availability`, values, getHeader());
};

export const fetchDateChangeAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `doctor/fetch-date-change-availability`, values, getHeader());
};

export const deleteDateAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `doctor/delete-date-availability`, values, getHeader());
};

export const fetchHolidayApi = values => {
  return axios.post(API_BASE_URL + `doctor/fetch-holiday`, values, getHeader());
};

export const doctorHolidayActionApi = values => {
  return axios.post(API_BASE_URL + `doctor/doctor-holiday-action`, values, getHeader());
};

export const getLanguagesApi = () => {
  return axios.get(API_BASE_URL + `home/get-languages`);
};

export const getFaqsApi = () => {
  return axios.get(API_BASE_URL + `home/get-faqs`);
};

export const fetchDoctorInfoApi = () => {
  return axios.get(API_BASE_URL + `doctor/fetch-info`, getHeader());
};

export const updateDoctorInfoApi = values => {
  return axios.post(API_BASE_URL + `doctor/update-info`, values, getHeader());
};

export const deleteDoctorInfoApi = values => {
  return axios.post(API_BASE_URL + `doctor/delete-info`, values, getHeader());
};

export const getPatientAppointmentApi = type => {
  return axios.get(API_BASE_URL + `appointment/getAppointment?type=${type}`, getHeader());
};

export const getAppointmentDetailsApi = id => {
  return axios.get(API_BASE_URL + `appointment/getAppointmentDetails?id=${id}`, getHeader());
};

export const addNurseByDoctorApi = values => {
  return axios.post(API_BASE_URL + `doctor/create-nurse`, values, getHeader());
};

export const editNurseByDoctorApi = values => {
  return axios.post(API_BASE_URL + `doctor/update-nurse`, values, getHeader());
};

export const fetchNurseByDoctorApi = () => {
  return axios.get(API_BASE_URL + `doctor/fetch-nurse`, getHeader());
};

export const deleteNurseByDoctorApi = values => {
  return axios.post(API_BASE_URL + `doctor/delete-nurse`, values, getHeader());
};

export const getDoctorDashboardApi = values => {
  return axios.post(API_BASE_URL + `doctor/dashboard`, values, getHeader());
};

export const getPatientListByDoctorApi = values => {
  return axios.post(API_BASE_URL + `patient/add-appointment-step1`, values, getHeader());
};

export const addPatientMemberApi = values => {
  return axios.post(API_BASE_URL + `patient/add-member`, values, getHeader());
};

export const dateAvailabilityApi = values => {
  return axios.post(API_BASE_URL + `patient/date-availability`, values, getHeader());
};

export const createAppointmentApi = values => {
  return axios.post(API_BASE_URL + `patient/create-appointment`, values, getHeader());
};

export const doctorUpdateMyAccountApi = values => {
  return axios.post(API_BASE_URL + `doctor/updateMyAccount`, values, getHeader());
};

export const activateAccountApi = values => {
  return axios.post(API_BASE_URL + `patient/activate-account`, values);
};

export const searchDoctorApi = values => {
  return axios.post(API_BASE_URL + `home/fetch-doctor`, values);
};

export const doctorDetailsPatientViewApi = values => {
  return axios.post(API_BASE_URL + `home/doctor-details`, values);
};

export const searchDoctorListApi = values => {
  return axios.post(API_BASE_URL + `home/search-doctor`, values);
};

export const searchAvailableDayListApi = values => {
  return axios.post(API_BASE_URL + `home/search-availableday`, values);
};

export const downloadAppTextApi = () => {
  return axios.get(API_BASE_URL + `home/download-app`);
};

export const patientFetchNoteApi = values => {
  return axios.post(API_BASE_URL + `patient/fetch-note`, values, getHeader());
};

export const createNoteApi = values => {
  return axios.post(API_BASE_URL + `patient/create-note`, values, getHeader());
};

export const doctorFetchAppointmentsApi = values => {
  return axios.post(API_BASE_URL + `doctor/fetch-appointments`, values, getHeader());
};

export const absenceAppointmentApi = values => {
  return axios.post(API_BASE_URL + `doctor/absence-appointment`, values, getHeader());
};

export const getAbsenceReasonApi = () => {
  return axios.get(API_BASE_URL + `home/get-absence-reason`);
};

export const getCancelReasonApi = () => {
  return axios.get(API_BASE_URL + `home/get-cancel-reason`);
};

export const cancelAppointmentApi = values => {
  return axios.post(API_BASE_URL + `doctor/cancel-appointment`, values, getHeader());
};

export const getRescheduleReasonApi = () => {
  return axios.get(API_BASE_URL + `home/get-reschedule-reason`);
};

export const rescheduleAppointmentApi = values => {
  return axios.post(API_BASE_URL + `doctor/reschedule-appointment`, values, getHeader());
};

export const getDelayReasonApi = () => {
  return axios.get(API_BASE_URL + `home/get-delay-reason`);
};

export const appointmentDetailsApi = values => {
  return axios.post(API_BASE_URL + `doctor/details-appointments`, values, getHeader());
};