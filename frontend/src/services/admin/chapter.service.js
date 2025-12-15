import axios from "../../customs/axios.customize";

const getAllChapterOfCourseService = async (courseId) => {
  let URL_BACKEND = `/admin/chapters?courseId=${courseId}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getAllChapterOfCourseService };
