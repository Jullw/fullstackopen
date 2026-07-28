const baseUrl = "api/blogs";

let token = null;

export const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const index = async () => {
  const response = await fetch(baseUrl);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? `HTTP error ${response.status}`);
  }

  return data;
};

const create = async (object) => {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      body: JSON.stringify(object),
      headers: { Authorization: token, "Content-Type": "application/json" },
    });
    const data = await response.json();

    if (!response.ok) {
      return [null, data.error || "error"];
    }

    return [data, null];
  } catch (error) {
    return [null, error.message];
  }
};

export default {
  index: index,
  create: create,
};
