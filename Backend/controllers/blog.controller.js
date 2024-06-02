import Blog from "../models/blog.model.js";
import Section from "../models/section.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createBlog = CatchAsync(async (req, res) => {
  const blog = {
    blogName: req.body.blogName,
    ...req.obj,
    status: "draft",
    sections: req.body.sections,
  };
  const sectionsData = JSON.parse(blog.sections).map((value, i) => {
    const { name, text } = value;
    const image = `localhost:8000/${req.files[i].filename}`;
    const id = i + 1;
    return { id, name, text, image };
  });
  blog.sections = sectionsData;
  const _blog = await Blog.create(blog);
  res.status(201).json({
    success: true,
    message: "Blog Created Successfully",
    _blog,
  });
});

export const getAllBlog = CatchAsync(async (req, res) => {
  const categoryId = req.category;
  const templateId = req.template;
  const subcategoryId = req.subcategory;
  let blogs = await Blog.findAll({
    where: { templateId, categoryId, subcategoryId },
  });
  if (!blogs) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  res.status(200).json({
    success: true,
    message: "blogs read successfully",
    blogs: blogs,
  });
});

export const getBlogID = CatchAsync(async (req, res) => {
  const categoryId = req.category;
  const templateId = req.template;
  const subcategoryId = req.subcategory;
  const blogId = req.params.id;
  const blog = await Blog.findOne({
    where: { id: blogId, templateId, categoryId, subcategoryId },
  });
  if (!blog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  res.status(200).json({
    success: true,
    message: "blog found successfully ",
    result: blog,
  });
});

export const updateBlog = CatchAsync(async (req, res) => {
  const blogId = req.params.id;

  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  existingBlog.blogName = req.body.blogName
    ? req.body.blogName
    : existingBlog.blogName;
  let sectionData;
  const newSections = JSON.parse(req.body.sections);
  if (newSections) {
    sectionData = JSON.parse(existingBlog.sections).map((section, i) => {
      let existingSection = section;
      const id = existingSection.id;

      newSections.map((section, i) => {
        if (id == section.id) {
          existingSection.name = section.name
            ? section.name
            : existingSection.name;
          existingSection.text = section.text
            ? section.text
            : existingSection.text;
          if (req.files.length > 0) {
            existingSection.image = `localhost:3000/${req.files[i].filename}`;
          }
        }
      });
      return { ...existingSection };
    });
  }
  existingBlog.sections = sectionData;
  console.log(existingBlog);
  const newBlog = await existingBlog.save();
  res.status(200).json({
    status: "success",
    message: "Blog updated successfully ",
    newBlog,
  });
});

export const deleteSection = CatchAsync(async (req, res) => {
  const blogId = req.params.id;

  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  const { idToDelete } = req.body;
  const sections = JSON.parse(existingBlog.sections);
  if (idToDelete) {
    sections.splice(idToDelete - 1, 1);
  }
  console.log(sections);
  existingBlog.sections = sections;
  const newBlog = await existingBlog.save();
  res.json({
    success: true,
    message: "Section deleted Successfully",
    newBlog,
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

export const approveBlog = CatchAsync(async (req, res) => {
  const blogId = req.params.id;

  const blog = await Blog.findOne({ where: { id: req.params.id } });
  if (!blog) {
    return next(new AppError("Blog not found!", 404));
  }
  blog.status = "approved";
  await blog.save();
  res.status(200).json({
    success: true,
    message: "Blog approved successfully",
    blog,
  });
});

export const rejectBlog = CatchAsync(async (req, res) => {
  const blog = await Blog.findOne({ where: { id: req.params.id } });
  if (!blog) {
    return next(new AppError("Blog not found!", 404));
  }
  blog.status = "rejected";

  await blog.save();
  res.status(200).json({
    success: true,
    message: "Blog rejected successfully",
    blog,
  });
});
