import axios from "../../customs/axios.customize";

const getStatsService = async () => {
  const response = await axios.get("/admin/dashboard/stats");
  return response;
};

const getRevenueChartService = async (year = new Date().getFullYear()) => {
  const response = await axios.get(
    `/admin/dashboard/revenue-chart?year=${year}`
  );
  return response;
};

const getStudentChartService = async (year = new Date().getFullYear()) => {
  const response = await axios.get(
    `/admin/dashboard/student-chart?year=${year}`
  );
  return response;
};

export { getStatsService, getRevenueChartService, getStudentChartService };
