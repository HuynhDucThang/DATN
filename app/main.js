import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { handleError } from "./middlewares/errors.js";
import routes from "./routers/index.js"

const app = express();
dotenv.config();

// dùng helmet để bảo vệ thông tin
app.use(express.static('app/public'))
// middleware
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

app.use(
  express.json({
    extended: true,
    limit: "50mb",
  })
);

app.use(cors());

// app.use(cors({ credentials: false, origin: ["*" , "http://localhost:3000/", "localhost", "localhost:3000"] }));

app.use(cookieParser());

// router(app);

app.use(routes);

// xử lý lỗi err cho controllers
app.use(handleError);

mongoose
  .connect(process.env.MONGOOSE_URL,)
  .then(() =>
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `you are listening on port ${process.env.PORT || 8080} and connect mongodb success!`
      );
    })
  )
  .catch((err) => console.error(err));
