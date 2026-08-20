import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./Data_Base/db.js";
import userRouter from "./routes/user.js";
import todoRouter from "./routes/todo.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

connectDB();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);
app.use('/api/profile', require('./routes/profile'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/lostfound', require('./routes/lostfound'));

// http://localhost:8000/api/v1/user/
// http://localhost:8000/api/v1/todo/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listen at port ${PORT}`);

})