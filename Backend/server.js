import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import {connectToDb} from "./database/database.js";
import cloudinary from "cloudinary";

console.log(process.env.NODE_ENV);
const port = process.env.PORT;

connectToDb();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(port, () => {
  console.log(`Server is Listening on ${port}...`);
});
