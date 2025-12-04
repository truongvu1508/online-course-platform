import axios from "../../customs/axios.customize";

const getAllCourseService = async (
  currentPage,
  pageSize,
  searchText = "",
  filterCategory = null
) => {
  let URL_BACKEND = `/admin/courses?limit=${pageSize}&page=${currentPage}`;

  if (searchText && searchText.trim() !== "") {
    URL_BACKEND += `&title=${searchText.trim()}`;
  }

  if (filterCategory) {
    URL_BACKEND += `&categoryId=${filterCategory}`;
  }

  const response = await axios.get(URL_BACKEND);

  return response;
};

const createCourseService = async (formData) => {
  const URL_BACKEND = "/admin/courses";

  const response = await axios.post(URL_BACKEND, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const updateCourseByIdService = async (id, formData) => {
  const URL_BACKEND = `/admin/courses`;

  const response = await axios.put(`${URL_BACKEND}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const deleteCourseByIdService = async (id) => {
  const URL_BACKEND = `/admin/courses`;

  const response = await axios.delete(`${URL_BACKEND}/${id}`);

  return response;
};

const getCourseByIdService = async (id) => {
  const URL_BACKEND = `/admin/courses/${id}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

export {
  getAllCourseService,
  createCourseService,
  updateCourseByIdService,
  deleteCourseByIdService,
  getCourseByIdService,
};
