import { BACKEND_URL } from "../util/Constants";
import { Roommate } from "./Roommate";

export const createRoommate = async (roommate: Roommate): Promise<Response> => {
  const url = BACKEND_URL + "/roommate/";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roommate),
  });
  return response;
};

export const loginRoommate = async (
  username: string,
  password: string
): Promise<Response> => {
  const url = BACKEND_URL + "/roommate/login";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response;
};

export const fetchAllProfiles = async (): Promise<Response> => {
  const url = BACKEND_URL + "/roommate/";
  return await authedGetRequest(url);
};

export const fetchRoommateProfile = async (
  roommateUsername?: string
): Promise<Response> => {
  const username =
    roommateUsername || window.sessionStorage.getItem("username");
  const url = BACKEND_URL + "/roommate/" + username;
  return await authedGetRequest(url);
};

export const fetchRecommendedProfiles = async (): Promise<Response> => {
  const username = window.sessionStorage.getItem("username") || "";
  const url = BACKEND_URL + "/roommate/recommendations/" + username;
  return await authedGetRequest(url);
};

export const fetchListUsernames = async (): Promise<Response> => {
  const username = window.sessionStorage.getItem("username") || "";
  const url = BACKEND_URL + "/roommate/list/" + username;
  return await authedGetRequest(url);
};

export const addUsernameToList = async (
  usernameToAdd: string
): Promise<Response> => {
  const username = window.sessionStorage.getItem("username") || "";
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = BACKEND_URL + "/roommate/list/" + username;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({ usernameToAdd }),
  });
  return response;
};

export const deleteUsernameFromList = async (
  usernameToDelete: string
): Promise<Response> => {
  const username = window.sessionStorage.getItem("username") || "";
  const accessToken = window.sessionStorage.getItem("accessToken");
  const url = BACKEND_URL + "/roommate/list/" + username;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    body: JSON.stringify({ usernameToDelete }),
  });
  return response;
};

export const fetchAreas = async (): Promise<Response> => {
  const url = BACKEND_URL + "/roommate/types/areas";
  return await unauthedGetRequest(url);
};

export const fetchHobbies = async (): Promise<Response> => {
  const url = BACKEND_URL + "/roommate/types/areas";
  return await unauthedGetRequest(url);
};

const unauthedGetRequest = async (url: string): Promise<Response> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response;
};

const authedGetRequest = async (url: string): Promise<Response> => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });
  return response;
};
