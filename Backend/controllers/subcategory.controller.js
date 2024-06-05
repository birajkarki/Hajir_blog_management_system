import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import Template from "../models/template.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from "../utils/catchAsync.js";

export const createSubCategory = CatchAsync(async (req, res) => {
  const subCategory = await SubCategory.create(req.obj);
  res.status(201).json({
    status: "success",
    message: "SubCategory Created Successfully",
    subCategory,
  });
});

export const getAllSubCategory = CatchAsync(async (req, res) => {
  const subCategories = await SubCategory.findAll({
    where: { templateId: req.template, categoryId: req.category },
    include: {
      model: Category,
      attributes: ["id", "categoryName"],
      include: {
        model: Template,
        attributes: ["id", "templateName"],
      },
    },
  });

  res.status(200).json({
    status: "success",
    result: subCategories.length,
    message: "SubCategories Fetched Successfully",
    subCategories,
  });
});

export const getSubCategoryID = CatchAsync(async (req, res) => {
  const subCategory = await SubCategory.findByPk(req.params.id);

  if (!subCategory) {
    return next(new AppError("Sub Category not found!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "SubCategory Fetched Successfully",
    subCategory,
  });
});

export const updateSubCategory = CatchAsync(async (req, res) => {
  const subCategory = await SubCategory.findByPk(req.params.id);

  if (!subCategory) {
    return next(new AppError("Sub Category not found!", 404));
  }

  const updatedSubcategory = await subCategory.update(req.body);
  res.status(200).json({
    status: "success",
    message: "SubCategory Updated Successfully",
    updatedSubcategory,
  });
});

export const deleteSubCategory = CatchAsync(async (req, res) => {
  const subCategory = await SubCategory.findByPk(req.params.id);

  if (!subCategory) {
    return next(new AppError("Sub Category not found!", 404));
  }

  await subCategory.destroy();
  res.status(200).json({
    status: "success",
    message: "SubCategory Deleted Successfully",
  });
});
