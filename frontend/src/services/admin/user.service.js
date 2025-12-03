import axios from "../../customs/axios.customize";

const getAllUserService = async (
  currentPage,
  pageSize,
  searchText = "",
  filterRole = null
) => {
  let URL_BACKEND = `/admin/users?limit=${pageSize}&page=${currentPage}`;

  if (searchText && searchText.trim() !== "") {
    URL_BACKEND += `&fullName=${searchText.trim()}`;
  }

  if (filterRole) {
    URL_BACKEND += `&role=${filterRole}`;
  }

  const response = await axios.get(URL_BACKEND);

  return response;
};

const createUserService = async (formData) => {
  const URL_BACKEND = "/admin/users";

  const response = await axios.post(URL_BACKEND, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const updateUserByIdService = async (id, formData) => {
  const URL_BACKEND = "/admin/users";

  const response = await axios.put(`${URL_BACKEND}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const deleteUserByIdService = async (id) => {
  const URL_BACKEND = "/admin/users";
  console.log(id);
  const response = await axios.delete(`${URL_BACKEND}/${id}`);

  return response;
};

export {
  getAllUserService,
  createUserService,
  updateUserByIdService,
  deleteUserByIdService,
};
