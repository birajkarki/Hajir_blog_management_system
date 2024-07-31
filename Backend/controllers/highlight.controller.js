import Highlight from "../models/highlight.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
export const createHighlight = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;
  res.json({ files: req.files });
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
    const image = imageUrls[i];
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
  //   console.log(highlightSections);
  try {
    res.json({
      highlightTitle,
      highlightDescription,
      highlightSections,
      blogId,
    });
    // const highlight = await Highlight.create({
    //   highlightTitle,
    //   highlightDescription,
    //   highlightSections,
    //   blogId,
    // });
    highlight.highlightSections = highlight.highlightSections.map((section) => {
      section.image = `${req.protocol}://${req.get("host")}/uploads/${
        section.image
      }`;
      return section;
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

  try {
    // Check if new images are provided
    if (
      req.body.highlightSections &&
      req.files &&
      req.files.highlightSectionImages
    ) {
      imageUrls = await Promise.all(
        req.files.highlightSectionImages.map((file) => {
          return file.filename;
        })
      );
    }
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
