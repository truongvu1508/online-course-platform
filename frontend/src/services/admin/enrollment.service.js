import axios from "../../customs/axios.customize";

const getEnrollmentCourse = async (courseId) => {
  const URL_BACKEND = `/admin/enrollments/course/${courseId}`;

  const response = axios.get(URL_BACKEND);

  return response;
};

export { getEnrollmentCourse };
