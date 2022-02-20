import { BACKEND_URL } from "../util/Constants";

export const fetchAllProfiles = async (): Promise<Response> => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = BACKEND_URL + "/roommate/";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};

export const fetchRoommateProfile = async (): Promise<Response> => {
  const username = window.sessionStorage.getItem("username");
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = BACKEND_URL + "/roommate/" + username;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};

export const fetchRecommendedProfiles = async (): Promise<Response> => {
  const username = window.sessionStorage.getItem("username");
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = BACKEND_URL + "/roommate/recommendations/" + username;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};
