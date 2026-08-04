const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getHeaders = () => ({
  Authorization: token,
  "Content-Type": "application/json",
});

const getAll = async () => {
  const response = await fetch(baseUrl, {
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "error");
  }

  return data;
};

const create = async (newObject) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(newObject),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "error");
  }

  return data;
};

const update = async (id, newObject) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(newObject),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "error");
  }

  return data;
};

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "error");
  }

  return true;
};

const likeOrDislike = async (id, object) => {
  const response = await fetch(`${baseUrl}/like/${id}`, {
    method: "PATCH",
    body: JSON.stringify(object),
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "error");
  }

  return data;
};

export default { getAll, create, update, remove, likeOrDislike, setToken };
