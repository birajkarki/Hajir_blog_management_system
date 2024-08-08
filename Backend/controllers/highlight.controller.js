import Highlight from "../models/highlight.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";
import { constructImageUrl } from "../utils/constructImageUrl.js";
import { deleteFiles } from "../utils/deleteFiles.js";

export const createHighlight = CatchAsync(async (req, res, next) => {
  const { blogId } = req.obj;

  // Extract filenames from uploaded files
  const imageUrls = req.files.map((file) => file.filename);

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

  try {
    const highlight = await Highlight.create({
      highlightTitle,
      highlightDescription,
      highlightSections: sectionData,
      blogId,
    });

    // Construct full image URLs for response
    const highlightResponse = {
      ...highlight.toJSON(),
      highlightSections: sectionData.map((section) => ({
        ...section,
        image: constructImageUrl(req, section.image), // Add full URL
      })),
    };

    res.status(201).json({
      success: true,
      message: "Highlight created successfully",
      highlight: highlightResponse,
    });
  } catch (error) {
    // Clean up any uploaded files in case of error
    const filesToDelete = req.files.map((file) => file.filename);
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
    return next(new AppError("Highlight not found", 404));
  }

  const highlightResponse = {
    ...highlights.toJSON(),
    highlightSections: JSON.parse(highlights.highlightSections).map(
      (section) => ({
        ...section,
        image: constructImageUrl(req, section.image),
      })
    ),
  };
  res.status(200).json({
    success: true,
    highlights: highlightResponse,
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
    imageUrls = req.files.highlightSectionImages.map((file) => file.filename);
  }

  // Retrieve the existing highlight
  const existingHighlight = await Highlight.findOne({ where: { blogId } });
  if (!existingHighlight) {
    return next(new AppError("Highlight Not Found ", 404));
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
        const id = existingHighlightSection.id;
        newHighlightSections.forEach((newHighlightSection, i) => {
          if (id === newHighlightSection.id) {
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
      highlight: {
        ...updatedHighlight.toJSON(),
        highlightSections: highlightSectionData.map((section) => ({
          ...section,
          image: constructImageUrl(req, section.image),
        })),
      },
    });
  } catch (error) {
    if (imageUrls.length > 0) {
      const filesToDelete = req.files.map((file) => file.filename);
      await deleteFiles(filesToDelete);
    }

    console.error("Error updating highlight:", error);
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
});
