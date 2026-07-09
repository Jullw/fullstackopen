const index = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const update = async (url, object) => {
  const updateUrl = `${url}/${object.id}`;
  try {
    const response = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });
    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

const create = async (url, object) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object),
    });
    const data = await response.json();

    if (!response.ok) {
      return [null, data];
    }

    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

const remove = async (url, id) => {
  const deleteUrl = `${url}/${id}`;
  try {
    await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return [{ message: "Note deleted successfully" }, null];
  } catch (error) {
    return [null, error];
  }
};

export default {
  index: index,
  update: update,
  create: create,
  remove: remove,
};
