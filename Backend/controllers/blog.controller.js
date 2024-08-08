import Blog from "../models/blog.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import { constructImageUrl } from "../utils/constructImageUrl.js";
import { deleteFiles } from "../utils/deleteFiles.js";

export const createBlog = CatchAsync(async (req, res, next) => {
  const blogImageUrl = req.files.blogImage[0].filename;
  const sectionImageUrls = req.files.sectionImages.map((file) => file.filename);

  const blog = {
    blogName: req.body.blogName,
    blogDescription: req.body.blogDescription,
    blogTitle: req.body.blogTitle,
    titleDescription: req.body.titleDescription,
    metaTag: req.body.metaTag,
    titleTag: req.body.titleTag,
    ...req.obj,
    status: "draft",
    slug: req.body.slug.replace(/\s+/g, "-").toLowerCase(),
    blogImage: blogImageUrl,
    sections: req.body.sections,
    blogImageAltText: req.body.blogImageAltText,
    blogImageDescription: req.body.blogImageDescription,
    blogImageCaption: req.body.blogImageCaption,
    canonicalTag: req.body.canonicalTag,
  };

  const sections = JSON.parse(blog.sections);
  if (!sections) {
    return next(new AppError("Section cannot be empty!", 404));
  }

  const sectionsData = sections.map((value, i) => {
    if (i !== sections.length) {
      const {
        name,
        text,
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      } = value;
      const image = sectionImageUrls[i];
      const id = i + 1;
      return {
        id,
        name,
        text,
        image,
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      };
    }
  });
  blog.sections = sectionsData;

  try {
    const newBlog = await Blog.create(blog);

    // Apply host and URL to blog image
    newBlog.blogImage = constructImageUrl(req, blogImageUrl);

    // Apply host and URL to section images
    newBlog.sections = sectionsData.map((section) => {
      const {
        id,
        name,
        text,
        image,
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      } = section;
      return {
        id,
        name,
        text,
        image: constructImageUrl(req, image),
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      };
    });

    res.status(201).json({
      success: true,
      message: "Blog Updated Successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
    const filesToDelete = [
      req.files.blogImage[0].filename,
      ...req.files.sectionImages.map((file) => file.filename),
    ];
    await deleteFiles(filesToDelete);
  }
});

export const getAllBlogs = CatchAsync(async (req, res, next) => {
  const { templateId, categoryId = null, subcategoryId } = req.obj;
  const { status } = req.query;

  let queryString = {};

  if (status) {
    queryString.status = status;
  }

  if (templateId) {
    queryString.templateId = templateId;
  }

  if (categoryId) {
    queryString.categoryId = categoryId;
  }

  if (subcategoryId) {
    queryString.subcategoryId = subcategoryId;
  }

  let blogs = await Blog.findAll({
    where: queryString,
  });
  const newBlogs = blogs.map((blog) => {
    blog.blogImage = constructImageUrl(req, blog.blogImage);
    blog.sections = JSON.parse(blog.sections).map((section) => {
      const {
        id,
        name,
        text,
        image,
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      } = section;
      return {
        id,
        name,
        text,
        image: constructImageUrl(req, image),
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      };
    });
    blog.sections = JSON.stringify(blog.sections);
    return blog;
  });
  res.json({
    success: true,
    result: newBlogs.length,
    message: "Blogs read successfully",
    blogs: newBlogs,
  });
});

export const getBlogID = CatchAsync(async (req, res, next) => {
  const blogId = req.params.id;

  const blog = await Blog.findOne({
    where: { id: blogId },
  });

  if (!blog) {
    return next(new AppError("Blog not Found with that ID!", 404));
  }

  blog.blogImage = constructImageUrl(req, blog.blogImage);

  // Apply host and URL to section images
  blog.sections = JSON.parse(blog.sections).map((section) => {
    const {
      id,
      name,
      text,
      image,
      sectionImageAltText,
      sectionImageDescription,
      sectionImageCaption,
    } = section;
    return {
      id,
      name,
      text,
      image: constructImageUrl(req, image),
      sectionImageAltText,
      sectionImageDescription,
      sectionImageCaption,
    };
  });
  blog.sections = JSON.stringify(blog.sections);
  res.status(201).json({
    success: true,
    message: "Blog Updated Successfully",
    blog: blog,
  });
});

export const getBlogBySlug = CatchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  console.log(req.params);
  const blog = await Blog.findOne({
    where: { slug: slug },
  });
  if (!blog) {
    return next(new AppError("Blog not Found with that slug!", 404));
  }
  blog.blogImage = constructImageUrl(req, blog.blogImage);

  // Apply host and URL to section images
  blog.sections = JSON.parse(blog.sections).map((section) => {
    const {
      id,
      name,
      text,
      image,
      sectionImageAltText,
      sectionImageDescription,
      sectionImageCaption,
    } = section;
    return {
      id,
      name,
      text,
      image: constructImageUrl(req, image),
      sectionImageAltText,
      sectionImageDescription,
      sectionImageCaption,
    };
  });
  blog.sections = JSON.stringify(blog.sections);
  res.status(201).json({
    success: true,
    message: "Blog Updated Successfully",
    blog: blog,
  });
});

export const updateBlog = CatchAsync(async (req, res, next) => {
  let blogImageUrl;
  let sectionImageUrls = [];
  let sectionData = [];
  if (req.files && req.files.blogImage && req.files.blogImage[0]) {
    blogImageUrl = req.files.blogImage[0].filename;
  }

  if (req.body.sections && req.files && req.files.sectionImages) {
    sectionImageUrls = await Promise.all(
      req.files.sectionImages.map((file) => {
        return file.filename;
      })
    );
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
  existingBlog.blogName = req.body.blogName
    ? req.body.blogName
    : existingBlog.blogName;
  existingBlog.blogDescription = req.body.blogDescription
    ? req.body.blogDescription
    : existingBlog.blogDescription;
  existingBlog.blogTitle = req.body.blogTitle
    ? req.body.blogTitle
    : existingBlog.blogTitle;
  existingBlog.titleDescription = req.body.titleDescription
    ? req.body.titleDescription
    : existingBlog.titleDescription;
  existingBlog.slug = req.body.slug ? req.body.slug : existingBlog.slug;
  existingBlog.titleTag = req.body.titleTag
    ? req.body.titleTag
    : existingBlog.titleTag;
  existingBlog.metaTag = req.body.metaTag
    ? req.body.metaTag
    : existingBlog.metaTag;
  existingBlog.canonicalTag = req.body.canonicalTag
    ? req.body.canonicalTag
    : existingBlog.canonicalTag;
  existingBlog.blogImageAltText = req.body.blogImageAltText
    ? req.body.blogImageAltText
    : existingBlog.blogImageAltText;
  existingBlog.blogImageDescription = req.body.blogImageDescription
    ? req.body.blogImageDescription
    : existingBlog.blogImageDescription;
  existingBlog.blogImageCaption = req.body.blogImageCaption
    ? req.body.blogImageCaption
    : existingBlog.blogImageCaption;
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
          existingSection.sectionImageAltText = newSection.sectionImageAltText
            ? newSection.sectionImageAltText
            : existingSection.sectionImageAltText;
          existingSection.sectionImageDescription =
            newSection.sectionImageDescription
              ? newSection.sectionImageDescription
              : existingSection.sectionImageDescription;
          existingSection.sectionImageCaption = newSection.sectionImageCaption
            ? newSection.sectionImageCaption
            : existingSection.sectionImageCaption;
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
    newBlog.blogImage = constructImageUrl(req, blogImageUrl);

    // Apply host and URL to section images
    newBlog.sections = sectionData.map((section) => {
      const {
        id,
        name,
        text,
        image,
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      } = section;
      return {
        id,
        name,
        text,
        image: constructImageUrl(req, image),
        sectionImageAltText,
        sectionImageDescription,
        sectionImageCaption,
      };
    });
    res.json({
      success: true,
      message: "Blog updated successfully",
      // existingBlog,
      newBlog,
    });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
    if (blogImageUrl) {
      const filesToDelete = [req.files.blogImage[0].filename];
      await deleteFiles(filesToDelete);
    }

    if (sectionImageUrls.length > 0) {
      const filesToDelete = [
        ...req.files.sectionImages.map((file) => file.filename),
      ];
      await deleteFiles(filesToDelete);
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
  });
});
