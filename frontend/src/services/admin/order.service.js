import axios from "../../customs/axios.customize";

const getAllOrders = async (currentPage, pageSize, filterStatus = null) => {
  let URL_BACKEND = `/admin/orders?limit=${pageSize}&page=${currentPage}`;

  if (filterStatus) {
    URL_BACKEND += `&status=${filterStatus}`;
  }

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getAllOrders };
