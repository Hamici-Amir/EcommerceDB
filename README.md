# 🚀 Server-Side Project

A Node.js-based server project using MongoDB, JWT authentication, and environment configuration.

---

## 📦 Requirements

- [Node.js](https://nodejs.org/) (vXX or higher)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- `npm` or `yarn`

---

## 🛠️ Project Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Create a `.env` File

Create a `.env` file in the root of the project and add the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
Password=your_password
UserName=your_username
ADMIN_PASSWORD=your_admin_password
```

> ⚠️ **Warning:** Do not commit the `.env` file to Git. It's already included in `.gitignore`.

---

## 🧪 Running the Project

### 🔹 Start in Production Mode

```bash
npm start
```

### 🔹 Start in Development Mode (with auto-reload)

```bash
npm run dev
```

---

## 🧹 Git Cleanup (If You Forgot `.gitignore`)

If you accidentally committed `.env` or `node_modules/`:

```bash
# Remove tracked sensitive files
git rm --cached .env
git rm -r --cached node_modules

# Add them to .gitignore
echo -e "node_modules/\n.env" >> .gitignore

# Commit changes
git add .gitignore
git commit -m "Clean .env and node_modules from Git and update .gitignore"
```

---

## 📂 Project Structure (Example)

```
├── server.js
├── routes/
│   └── api.js
├── models/
│   └── User.js
├── controllers/
│   └── authController.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 📜 License

This project is licensed under the **MIT License**.
