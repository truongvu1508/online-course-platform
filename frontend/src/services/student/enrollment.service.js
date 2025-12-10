import axios from "../../customs/axios.customize";

const getEnrollmentService = async () => {
  const URL_BACKEND = "/student/enrollments";

  const response = await axios.get(URL_BACKEND);

  return response;
};

const getEnrollmentByIdService = async (enrollmentId) => {
  const URL_BACKEND = `/student/enrollments/${enrollmentId}`;

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getEnrollmentService, getEnrollmentByIdService };
