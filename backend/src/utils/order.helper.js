import Order from "../models/order.model.js";

export const generateOrderNumber = async () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const orderNumber = `ORD-${timestamp}-${random}`;

  // check ma don hang
  const existingOrder = await Order.findOne({ orderNumber });
  if (existingOrder) {
    return generateOrderNumber();
  }

  return orderNumber;
};
