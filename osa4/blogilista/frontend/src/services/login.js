import { setToken } from "./blogs";
const baseUrl = "api/login";

const login = async (object) => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return [null, data.error || "error"];
    }

    setToken(data.token);
    window.localStorage.setItem("user", JSON.stringify(data));

    return [data, null];
  } catch (error) {
    return [null, error.message];
  }
};

export default {
  login: login,
};
