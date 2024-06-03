import Blog from "../models/blog.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createBlog = CatchAsync(async (req, res) => {
  const blog = {
    blogName: req.body.blogName,
    ...req.obj,
    status: "draft",
    blogDescription: req.body.blogDescription,
    blogImage: `localhost:3000/${req.files[0].filename}`,
    sections: req.body.sections,
  };
  const sections = JSON.parse(blog.sections);
  // console.log(sections);
  const sectionsData = sections.map((value, i) => {
    if (i !== sections.length) {
      const { name, text } = value;
      const image = `localhost:3000/${req.files[i + 1].filename}`;
      const id = i + 1;
      return { id, name, text, image };
    }
  });
  blog.sections = sectionsData;
  console.log(blog);
  const _blog = await Blog.create(blog);
  res.status(201).json({
    status: "success",
    message: "Blog Created Successfully",
    _blog,
  });
});

export const getAllBlogs = CatchAsync(async (req, res) => {
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
    status: "success",
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
    status: "success",
    message: "blog found successfully ",
    result: blog,
  });
});

export const updateBlog = CatchAsync(async (req, res) => {
  const blogId = req.params.id;
  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return next(new AppError("Blog not found!",404))
  }
  existingBlog.blogName = req.body.blogName
    ? req.body.blogName
    : existingBlog.blogName;
  existingBlog.blogDescription = req.body.blogDescription
    ? req.body.blogDescription
    : existingBlog.blogDescription;
  existingBlog.blogImage = req.files.blogImage[0]
    ? `localhost:3000/${req.files.blogImage[0].filename}`
    : existingBlog.blogImage;
  let sectionData;
  if (req.body.sections) {
    const newSections = JSON.parse(req.body.sections);
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
          if (req.files.sectionImages.length > 0) {
            existingSection.image = `localhost:3000/${req.files.sectionImages[i].filename}`;
          }
        }
      });
      return { ...existingSection };
    });
  }

  existingBlog.sections = sectionData ? sectionData : existingBlog.sections;
  res.json({
    status: "success",
    message: "Blog updated successfully",
    existingBlog,
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
    status: "success",
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
    status: "success",
    message: "Blog rejected successfully",
    blog,
  });
});
