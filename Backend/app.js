import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/user.route.js";
import templateRoute from "./routes/template.route.js";
import subCategoryRoute from "./routes/subcategory.route.js";
import categoryRoute from "./routes/category.route.js";
import blogRoute from "./routes/blog.route.js";
import highlightRoute from "./routes/highlight.routes.js";
import reviewRoute from "./routes/review.route.js";
import ppRoute from "./routes/privacypolicy.route.js";
import globalErrorHandler from "./controllers/error.controller.js";
import extractObj from "./middlewares/extract.js";

const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://backendhajir-blogmanagement.onrender.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// ROUTES
app.use("/api/v1/user", userRoute);
app.use("/api/v1/template", templateRoute);
app.use("/api/v1/:templateId/category", extractObj, categoryRoute);
app.use(
  "/api/v1/:templateId/:categoryId/subcategory/",
  extractObj,
  subCategoryRoute
);
app.use("/api/v1/:templateId/subcategory/", extractObj, subCategoryRoute);
app.use(
  "/api/v1/:templateId/:categoryId/:subcategoryId/blog",
  extractObj,
  blogRoute
);
app.use("/api/v1/blog", extractObj, blogRoute);
app.use("/api/v1/:templateId/:subcategoryId/blog", extractObj, blogRoute);
app.use("/api/v1/:blogId/highlight", extractObj, highlightRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/privacy-policy", ppRoute);
app.use(globalErrorHandler);

export default app;
