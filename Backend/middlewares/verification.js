import Category from '../models/category.model.js';
import SubCategory from '../models/subCategory.model.js';
import Template from '../models/template.model.js';
import AppError from '../utils/AppError.js';
import { CatchAsync } from '../utils/catchAsync.js';


export const verifyTemplate = CatchAsync(async (req, res, next) => {
  const templateId = req.obj.templateId;
  const template = await Template.findByPk(templateId);

  if (!template) {
    return res.status(404).json({ message: "Template not found" });
  }
  req.template = template.id;
  next();
});

export const verifyCategory = CatchAsync(async (req, res, next) => {
  const categoryId = req.obj.categoryId;
  const category = await Category.findByPk(categoryId);

  if (!category) {
    return next(new AppError("Category not Found", 404));
  }
  req.category = category.id;
  next();
});

export const verifySubcategory = CatchAsync(async (req, res, next) => {
  const subcategoryId = req.obj.subcategoryId;

  const subcategory = await SubCategory.findByPk(subcategoryId);

  if (!subcategory) {
    return next(new AppError("Subcategory not Found", 404));
  }
  req.subcategory = subcategory.id;
  next();
});
