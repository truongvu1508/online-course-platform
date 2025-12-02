import axios from "../../customs/axios.customize";

const getAccountService = async () => {
  const URL_BACKEND = "/shared/auth/account";

  const response = await axios.get(URL_BACKEND);

  return response;
};

export { getAccountService };
