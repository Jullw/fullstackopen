const index = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
};

export default {
  index: index,
};
