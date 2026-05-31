// require('dotenv').config({path: './env'})
import express from "express"
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js"


dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 5000

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", authRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});