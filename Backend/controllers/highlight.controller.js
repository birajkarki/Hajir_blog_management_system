import Highlight from "../models/highlight.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
export const createHighlight = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;

  const imageUrls = await Promise.all(
    req.files.map((file) => {
      return file.filename;
    })
  );
  let { highlightTitle, highlightDescription, highlightSections } = req.body;
  highlightSections = JSON.parse(highlightSections);
  let sectionData;
  if (!highlightSections) {
    return next(new AppError("Highlight sections cannot be empty"), 404);
  }
  sectionData = highlightSections.map((value, i) => {
    const {
      title,
      description,
      highlightImageAltText,
      highlightImageDescription,
      highlightImageCaption,
    } = value;
    const image = `${req.protocol}://${req.get("host")}/uploads/${
      imageUrls[i]
    }`;
    const id = i + 1;
    return {
      id,
      title,
      description,
      image,
      highlightImageAltText,
      highlightImageDescription,
      highlightImageCaption,
    };
  });
  highlightSections = sectionData;
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
    const filesToDelete = [req.files.map((file) => file.filename)];
    await deleteFiles(filesToDelete);
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
  if (
    req.body.highlightSections &&
    req.files &&
    req.files.highlightSectionImages
  ) {
    imageUrls = await Promise.all(
      req.files.highlightSectionImages.map((file) => {
        return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
      })
    );
  }

  // try {
  // Check if new images are provided

  //   // Retrieve the existing highlight
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
    const newHighlightSections = JSON.parse(req.body.highlightSections);
    highlightSectionData = JSON.parse(existingHighlight.highlightSections).map(
      (highlightSection) => {
        let existingHighlightSection = highlightSection;
        // console.log(existingHighlightSection);
        const id = existingHighlightSection.id;
        newHighlightSections.forEach((newHighlightSection, i) => {
          if (id === newHighlightSection.id) {
            console.log(newHighlightSection);
            existingHighlightSection.title = newHighlightSection.title
              ? newHighlightSection.title
              : existingHighlightSection.title;
            existingHighlightSection.description =
              newHighlightSection.description
                ? newHighlightSection.description
                : existingHighlightSection.description;
            existingHighlightSection.highlightImageAltText =
              newHighlightSection.highlightImageAltText
                ? newHighlightSection.highlightImageAltText
                : existingHighlightSection.highlightImageAltText;
            existingHighlightSection.highlightImageDescription =
              newHighlightSection.highlightImageDescription
                ? newHighlightSection.highlightImageDescription
                : existingHighlightSection.highlightImageDescription;
            existingHighlightSection.highlightImageCaption =
              newHighlightSection.highlightImageCaption
                ? newHighlightSection.highlightImageCaption
                : existingHighlightSection.highlightImageCaption;
            if (
              req.files.highlightSectionImages &&
              req.files.highlightSectionImages.length > 0 &&
              imageUrls[i]
            ) {
              existingHighlightSection.image = imageUrls[i];
            }
          }
        });
        return { ...existingHighlightSection };
      }
    );
  }

  existingHighlight.highlightSections = highlightSectionData.length
    ? highlightSectionData
    : existingHighlight.highlightSections;

  try {
    const updatedHighlight = await existingHighlight.save();
    res.status(200).json({
      success: true,
      message: "Highlight updated successfully",
      highlight: updatedHighlight,
      // existingHighlight,
    });
  } catch (error) {
    if (imageUrls.length > 0) {
      const filesToDelete = [req.files.map((file) => file.filename)];
      await deleteFiles(filesToDelete);
    }

    console.error("Error updating highlight:", error);
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
});
