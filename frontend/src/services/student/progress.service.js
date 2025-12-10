import axios from "../../customs/axios.customize";

const updateEnrollmentProgress = async (enrollmentId, lectureId) => {
  const URL_BACKEND = "/student/progress";

  const response = await axios.post(URL_BACKEND, { enrollmentId, lectureId });

  return response;
};

export { updateEnrollmentProgress };
