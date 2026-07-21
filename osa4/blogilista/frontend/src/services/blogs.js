const index = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? `HTTP error ${response.status}`);
  }

  return data;
};

export default {
  index: index,
};
