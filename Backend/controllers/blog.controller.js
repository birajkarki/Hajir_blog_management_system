import Blog from "../models/blog.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";

export const createBlog = CatchAsync(async (req, res, next) => {
  const blogImageUpload = await cloudinary.uploader.upload(
    req.files.blogImage[0].path
  );
  const blogImageUrl = blogImageUpload.secure_url;
  const sectionImageUploads = await Promise.all(
    req.files.sectionImages.map((file) => cloudinary.uploader.upload(file.path))
  );
  const sectionImageUrls = sectionImageUploads.map(
    (upload) => upload.secure_url
  );

  const blog = {
    blogName: req.body.blogName,
    blogDescription: req.body.blogDescription,
    blogTitle: req.body.blogTitle,
    titleDescription: req.body.titleDescription,
    metaTag: req.body.metaTag,
    titleTag: req.body.titleTag,
    ...req.obj,
    status: "draft",
    slug: req.body.slug,
    blogImage: blogImageUrl,
    sections: req.body.sections,
  };
  const sections = JSON.parse(blog.sections);
  if (!sections) {
    return next(new AppError("Section cannot be empty!", 404));
  }

  const sectionsData = sections.map((value, i) => {
    if (i !== sections.length) {
      const { name, text } = value;
      const image = sectionImageUrls[i];
      const id = i + 1;
      return { id, name, text, image };
    }
  });
  blog.sections = sectionsData;
  try {
    const _blog = await Blog.create(blog);
    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      blog: _blog,
    });
  } catch (error) {
    if (blogImageUrl) {
      const publicId = blogImageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    if (sectionImageUrls.length > 0) {
      await Promise.all(
        sectionImageUrls.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );
    }
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
});

export const getAllBlogs = CatchAsync(async (req, res, next) => {
  const { templateId, categoryId = null, subcategoryId } = req.obj;
  let blogs = await Blog.findAll({
    where: { templateId, categoryId, subcategoryId },
  });
  res.status(200).json({
    success: true,
    message: "blogs read successfully",
    blogs: blogs,
  });
});

export const getBlogID = CatchAsync(async (req, res, next) => {
  const { templateId, categoryId = null, subcategoryId } = req.obj;
  const blogId = req.params.id;
  const blog = await Blog.findOne({
    where: { id: blogId },
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

export const updateBlog = CatchAsync(async (req, res, next) => {
  let blogImageUrl;
  let sectionImageUrls = [];
  let sectionData = [];
  if (req.files && req.files.blogImage && req.files.blogImage[0]) {
    const blogImageUpload = await cloudinary.uploader.upload(
      req.files.blogImage[0].path
    );
    blogImageUrl = blogImageUpload.secure_url;
  }

  if (req.body.sections && req.files && req.files.sectionImages) {
    const sectionImageUploads = await Promise.all(
      req.files.sectionImages.map((file) =>
        cloudinary.uploader.upload(file.path)
      )
    );
    sectionImageUrls = sectionImageUploads.map((upload) => upload.secure_url);
  }

  const blogId = req.params.id;
  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  // Update existing blog properties
  existingBlog.title = req.body.title ? req.body.title : existingBlog.blogName;
  existingBlog.content = req.body.content
    ? req.body.content
    : existingBlog.blogName;
  existingBlog.blogName = req.body.blogName
    ? req.body.blogName
    : existingBlog.blogName;
  existingBlog.blogDescription = req.body.blogDescription
    ? req.body.blogDescription
    : existingBlog.blogDescription;
  existingBlog.slug = req.body.slug ? req.body.slug : existingBlog.slug;
  existingBlog.blogImage = blogImageUrl ? blogImageUrl : existingBlog.blogImage;

  if (req.body.sections) {
    const newSections = JSON.parse(req.body.sections);
    sectionData = JSON.parse(existingBlog.sections).map((section) => {
      let existingSection = section;
      const id = existingSection.id;

      newSections.forEach((newSection, i) => {
        if (id === newSection.id) {
          existingSection.name = newSection.name
            ? newSection.name
            : existingSection.name;
          existingSection.text = newSection.text
            ? newSection.text
            : existingSection.text;

          if (
            req.files.sectionImages &&
            req.files.sectionImages.length > 0 &&
            sectionImageUrls[i]
          ) {
            existingSection.image = sectionImageUrls[i];
          }
        }
      });

      return { ...existingSection };
    });
  }

  existingBlog.sections = sectionData.length
    ? sectionData
    : existingBlog.sections;
  try {
    const newBlog = await existingBlog.save();

    res.json({
      success: true,
      message: "Blog updated successfully",
      newBlog,
    });
  } catch (error) {
    if (blogImageUrl) {
      const publicId = blogImageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    if (sectionImageUrls.length > 0) {
      await Promise.all(
        sectionImageUrls.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );
    }

    res.status(500).json({
      success: false,
      message: "An error occurred while updating the blog.",
      error: error.message,
    });
  }
});

export const deleteSection = CatchAsync(async (req, res, next) => {
  const blogId = req.params.id;

  const existingBlog = await Blog.findByPk(blogId);
  if (!existingBlog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }
  const { idToDelete } = req.body;
  const sections = JSON.parse(existingBlog.sections);
  if (!idToDelete) {
    return next(new AppError("No id found!", 404));
  }
  sections.splice(idToDelete - 1, 1);
  // console.log(sections);
  existingBlog.sections = sections;
  const newBlog = await existingBlog.save();
  res.json({
    success: true,
    message: "Section deleted Successfully",
    newBlog,
  });
});

export const deleteBlog = CatchAsync(async (req, res, next) => {
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

export const approveBlog = CatchAsync(async (req, res, next) => {
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

export const rejectBlog = CatchAsync(async (req, res, next) => {
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
