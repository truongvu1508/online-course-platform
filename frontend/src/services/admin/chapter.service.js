import axios from "../../customs/axios.customize";

const getAllChapterOfCourseService = async (courseId) => {
  let URL_BACKEND = `/admin/chapters?courseId=${courseId}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

const getChapterByIdService = async (id) => {
  const URL_BACKEND = `/admin/chapters/${id}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

const createChapterService = async (data) => {
  const URL_BACKEND = "/admin/chapters";

  const response = await axios.post(URL_BACKEND, data);

  return response;
};

const updateChapterService = async (id, data) => {
  const URL_BACKEND = `/admin/chapters/${id}`;

  const response = await axios.put(URL_BACKEND, data);

  return response;
};

const deleteChapterService = async (id) => {
  const URL_BACKEND = `/admin/chapters/${id}`;

  const response = await axios.delete(URL_BACKEND);

  return response;
};

export {
  getAllChapterOfCourseService,
  getChapterByIdService,
  createChapterService,
  updateChapterService,
  deleteChapterService,
};
