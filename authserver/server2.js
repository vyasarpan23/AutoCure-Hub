const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./authRoutes");
app.use("/auth", authRoutes);

const PORT =  5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
