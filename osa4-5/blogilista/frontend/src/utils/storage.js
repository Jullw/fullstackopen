export const getStoredUser = () => {
  const loggedUserJSON = window.localStorage.getItem("user");

  if (!loggedUserJSON) {
    return null;
  }

  try {
    return JSON.parse(loggedUserJSON);
  } catch {
    window.localStorage.removeItem("user");
    return null;
  }
};
