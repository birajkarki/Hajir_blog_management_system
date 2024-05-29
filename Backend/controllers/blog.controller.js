import Blog from "../models/blog.model.js";
import Category from '../models/category.model.js';
import SubCategory from "../models/subCategory.model.js";
import Template from "../models/template.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createBlog = CatchAsync(async (req, res, next) => {
  const blog = {
    blogName: req.body.blogName,
    ...req.obj,
    sections: req.body.sections,
  };
  console.log(blog);
  const sectionsData = JSON.parse(blog.sections).map((value, i) => {
    const { name, text } = value;
    const image = `localhost:3000/${req.files[i].filename}`;
    return { name, text, image };
  });
  blog.sections = sectionsData;

  const newBlog = await Blog.create(blog);
  res.json({
    success: true,
    message: "Blog Created Successfully",
    newBlog,
  });
});

export const getAllBlogs = CatchAsync(async (req, res, next) => {
  const blogs = await Blog.findAll({
    include: {
      model: SubCategory,
      attributes: ["id", "subCategoryName"],
      include: {
        model: Category,
        attributes: ["id", "categoryName"],
        include: {
          model: Template,
          attributes: ["id", "templateName"],
        },
      },
    },
  });
  res.status(200).json({
    status: "success",
    results: blogs.length,
    message: "blogs Fetched successfully",
    blogs: blogs,
  });
});

export const getBlog = CatchAsync(async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }

  res.json({
    status: "success",
    message: "blog Fetched successfully ",
    result: blog,
  });
});

export const updateBlog = CatchAsync(async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }

  console.log(req.body);
  const updatedBlog = await blog.update(req.body);
  res.status(200).json({
    status: "success",
    message: "Blog updated successfully",
    updatedBlog,
  });
});
export const deleteBlog = CatchAsync(async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  if (!blog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  await blog.destroy();

  res.status(200).json({
    status: "success",
    message: "Blog Deleted successfully ",
  });
});
