import Blog from "../models/blog.model.js";
import Category from '../models/category.model.js';
import SubCategory from '../models/subCategory.model.js';
import Template from "../models/template.model.js";
import AppError from "../utils/AppError.js";
import { CatchAsync } from '../utils/catchAsync.js';

export const createTemplate = CatchAsync(async (req, res, next) => {
  const template = await Template.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Template Created Successfully",
    template,
  });
});

export const getAllTemplates = CatchAsync(async (req, res, next) => {
  const templates = await Template.findAll({
    include: {
      model: Category,
      attributes: ["id", "categoryName" ],
      include: {
        model: SubCategory,
        attributes: ['id', "subCategoryName"]
      }
    }
    
  });
  res.status(200).json({
    status: "success",
    message: "Templates Fetched Successfully",
    templates,
  });
});
export const getTemplate = CatchAsync(async (req, res, next) => {
  const template = await Template.findByPk(req.params.id);
  if (!template) {
    return next(new AppError("Template does not exist"), 404);
  }
  res.status(200).json({
    status: "success",
    message: "Template Fetched Successfully",
    template,
  });
});
export const updateTemplate = CatchAsync(async (req, res, next) => {
  let template = await Template.findByPk(req.params.id);
  if (!template) {
    return next(new AppError("Template does not exist"), 404);
  }

  await Template.update(req.body, { where: { id: req.params.id } });
  res.status(200).json({
    status: "success",
    message: "Template Updated Successfully",
  });
});

export const deleteTemplate = CatchAsync(async (req, res, next) => {
  let template = await Template.findByPk(req.params.id);
  if (!template) {
    return next(new AppError("Template does not exist", 404));
  }

  await template.destroy({ where: { id: req.params.id } });
  res.status(200).json({
    status: "success",
    message: "Template Deleted Successfully",
  });
});
