import axios from "../../customs/axios.customize";

const getAllCategoryPublic = async () => {
  const URL_BACKEND = "/categories";

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getAllCategoryPublic };
