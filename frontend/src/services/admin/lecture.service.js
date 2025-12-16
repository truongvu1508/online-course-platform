import axios from "../../customs/axios.customize";

const getAllLectureOfChapterService = async (chapterId) => {
  let URL_BACKEND = `/admin/lectures?chapterId=${chapterId}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

const getLectureByIdService = async (id) => {
  const URL_BACKEND = `/admin/lectures/${id}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

const createLectureService = async (data) => {
  const URL_BACKEND = "/admin/lectures";

  const response = await axios.post(URL_BACKEND, data);

  return response;
};

const updateLectureService = async (id, data) => {
  const URL_BACKEND = `/admin/lectures/${id}`;

  const response = await axios.put(URL_BACKEND, data);

  return response;
};

const deleteLectureService = async (id) => {
  const URL_BACKEND = `/admin/lectures/${id}`;

  const response = await axios.delete(URL_BACKEND);

  return response;
};

export {
  getAllLectureOfChapterService,
  getLectureByIdService,
  createLectureService,
  updateLectureService,
  deleteLectureService,
};
