import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}users/register/`,
      userData
    );

    if (response.status === 201) {
      console.log("User successfully created: ", response.data);
      const data = response.data;

      const access_token = data.tokens.access;
      const refresh_token = data.tokens.refresh;

      localStorage.setItem("auth_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
    }
  } catch (err) {
    console.error("Failed to register user:", err);
  }
};

export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/login/`, userData);

    if (response.status !== 200) {
      console.error("Request failed.");
      return null;
    }

    const data = response.data;

    const access_token = data.tokens.access;
    const refresh_token = data.tokens.refresh;

    localStorage.setItem("auth_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);

    return data.user;
  } catch (err) {
    console.error("Login failed:", err);
    return null;
  }
};
