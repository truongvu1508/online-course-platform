import axios from "../../customs/axios.customize";

const orderFromCartService = async () => {
  const URL_BACKEND = "/student/orders";

  const response = await axios.post(URL_BACKEND, {
    fromCart: true,
    paymentMethod: "vnpay",
  });

  return response;
};

const orderNowService = async (courseId) => {
  const URL_BACKEND = "/student/orders";

  const response = await axios.post(URL_BACKEND, {
    items: [{ courseId }],
    paymentMethod: "vnpay",
  });

  return response;
};

export { orderFromCartService, orderNowService };
