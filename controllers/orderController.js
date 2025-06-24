import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { user, orderItems, total } = req.body;

  const newOrder = new Order({ user, orderItems, total });
  const saved = await newOrder.save();

  res.status(201).json(saved);
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user").populate("orderItems.product");
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user").populate("orderItems.product");
  if (!order) return res.status(404).json({ msg: "Order not found" });
  res.json(order);
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(updated);
};

export const deleteOrder = async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ msg: "Order deleted" });
};
