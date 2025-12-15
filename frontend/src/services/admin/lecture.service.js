import axios from "../../customs/axios.customize";

const getAllLectureOfChapterService = async (chapterId) => {
  let URL_BACKEND = `/admin/lectures?chapterId=${chapterId}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getAllLectureOfChapterService };
