import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

// Serve static files (CSS, JS, images) from templates directory
app.use(express.static(path.join(__dirname, 'templates')));

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Home page route (renders index.ejs)
app.get('/', (req, res) => {
  res.render('index');
});

// Route to render the add product page
app.get('/add-product', (req, res) => {
  res.render('add-product');
});

// Route to render the add category page
app.get('/add-category', (req, res) => {
  res.render('add-category');
});

// Route to render the manage products page
app.get('/manage-products', (req, res) => {
  res.render('manage-products');
});

// Route to render the manage categories page
app.get('/manage-categories', (req, res) => {
  res.render('manage-categories');
});

// Route to render the dashboard page
app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
