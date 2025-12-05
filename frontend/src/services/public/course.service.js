import axios from "../../customs/axios.customize";

const getCoursesNewestPublic = async () => {
  const URL_BACKEND = "/courses/newest";

  const response = await axios.get(URL_BACKEND);

  return response.data;
};

const getCoursesBestSellerPublic = async () => {
  const URL_BACKEND = "/courses/best-sellers";

  const response = await axios.get(URL_BACKEND);

  return response.data;
};

const getCoursesRatingPublic = async () => {
  const URL_BACKEND = "/courses/rating";

  const response = await axios.get(URL_BACKEND);

  return response.data;
};

const getAllCoursesPublic = async (
  currentPage,
  pageSize,
  filterRating,
  filterDuration,
  filterCategory,
  filterLevel
) => {
  let URL_BACKEND = `/courses?limit=${pageSize}&page=${currentPage}`;

  if (filterRating) {
    URL_BACKEND += `&minRating=${filterRating}`;
  }

  if (filterDuration) {
    URL_BACKEND += `&duration=${filterDuration}`;
  }

  if (filterCategory) {
    URL_BACKEND += `&categoryId=${filterCategory}`;
  }

  if (filterLevel) {
    URL_BACKEND += `&level=${filterLevel}`;
  }

  const response = await axios.get(URL_BACKEND);

  return response;
};

export {
  getCoursesNewestPublic,
  getCoursesBestSellerPublic,
  getCoursesRatingPublic,
  getAllCoursesPublic,
};
