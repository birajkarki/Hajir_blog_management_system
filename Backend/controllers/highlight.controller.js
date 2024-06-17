import Highlight from "../models/highlight.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import cloudinary from "cloudinary";
export const createHighlight = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;
  const sectionImageUploads = await Promise.all(
    req.files.map((file) => cloudinary.uploader.upload(file.path))
  );
  const imageUrls = sectionImageUploads.map((upload) => upload.secure_url);
  //   console.log(imageUrls);
  //   console.log(req.body);
  let { highlightTitle, highlightDescription, highlightSections } = req.body;
  highlightSections = JSON.parse(highlightSections);
  let sectionData;
  if (!highlightSections) {
    return next(new AppError("Highlight sections cannot be empty"), 404);
  }
  sectionData = highlightSections.map((value, i) => {
    const { title, description } = value;
    const image = imageUrls[i];
    const id = i + 1;
    return { id, title, description, image };
  });
  highlightSections = sectionData;
  //   console.log(highlightSections);
  try {
    const highlight = await Highlight.create({
      highlightTitle,
      highlightDescription,
      highlightSections,
      blogId,
    });
    res.status(201).json({
      success: true,
      message: "Highlight created successfully",
      highlight,
    });
  } catch (error) {
    if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map((url) => {
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
export const getHighlights = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;
  const highlights = await Highlight.findOne({ where: { blogId } });
  if (!highlights) {
    return next(new AppError("Highlight sections cannot be empty"), 404);
  }
  res.status(200).json({
    success: true,
    message: "Highlight fetched successfully",
    highlights,
  });
});

export const updateHighlight = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;
  let imageUrls = [];
  let highlightSectionData = [];

  try {
    // Check if new images are provided
    if (
      req.files &&
      req.files.highlightSectionImages &&
      req.files.highlightSectionImages.length > 0
    ) {
      const sectionImageUploads = await Promise.all(
        req.files.map((file) => cloudinary.uploader.upload(file.path))
      );
      imageUrls = sectionImageUploads.map((upload) => upload.secure_url);
    }

    // Retrieve the existing highlight
    const existingHighlight = await Highlight.findOne({ where: { blogId } });
    if (!existingHighlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    existingHighlight.highlightTitle = req.body.highlightTitle
      ? req.body.highlightTitle
      : existingHighlight.highlightTitle;
    existingHighlight.highlightDescription = req.body.highlightDescription
      ? req.body.highlightDescription
      : existingHighlight.highlightDescription;

    if (req.body.highlightSections) {
      try {
        const newHighlightSections = JSON.parse(req.body.highlightSections);
        highlightSectionData = JSON.parse(
          existingHighlight.highlightSections
        ).map((section, index) => {
          const newHighlightSection = newHighlightSections[index];
          section.title = newHighlightSection.title || section.title;
          section.description =
            newHighlightSection.description || section.description;
          if (imageUrls[index]) {
            section.image = imageUrls[index];
          }
          return section;
        });
      } catch (error) {
        console.error("Error parsing highlight sections JSON:", error);
        return res.status(400).json({
          success: false,
          message: "Invalid highlight sections format",
        });
      }
    }

    existingHighlight.highlightSections = highlightSectionData.length
      ? highlightSectionData
      : existingHighlight.highlightSections;

    // const updatedHighlight = await existingHighlight.save();

    res.status(200).json({
      success: true,
      message: "Highlight updated successfully",
      // highlight: updatedHighlight,
      existingHighlight,
    });
  } catch (error) {
    if (imageUrls.length > 0) {
      await Promise.all(
        imageUrls.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );
    }

    console.error("Error updating highlight:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
