// require('dotenv').config({path: './env'})
import express from "express"
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./db/db.js";


dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors());

app.use(express.json());

app.get("/test", (req, res) => {
    res.send("TEST API is running....")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

connectDB()











/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/