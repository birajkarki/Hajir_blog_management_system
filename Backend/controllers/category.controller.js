import Category from "../models/category.model.js";
import Template from '../models/template.model.js';
import AppError from '../utils/AppError.js';
import { CatchAsync } from '../utils/catchAsync.js';

export const createCategory = CatchAsync(async (req, res) => {
    const categroy = await Category.create(req.obj);
    res.status(201).json({
      status: "success",
      message: "Categroy Created Successfully",
      categroy,
    });
  });
  
  export const getAllCategory = CatchAsync(async (req, res) => {
    const categories = await Category.findAll({
      where: {templateId: req.template},
      include: [
        {
          model: Template,
          attributes: ["id", "templateName"],
        },
      ],
    });


  
    res.status(200).json({
      status: "success",
      result: categories.length,
      message: "Categories Fetched Successfully",
      categories,
    });
  });
  
  export const getCategoryId = CatchAsync(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
  
    if (!category) {
      return next(new AppError("Category not found!", 404));
    }
  
    res.status(200).json({
      status: "success",
      message: "category Fetched Successfully",
      category,
    });
  });
  
  export const updateCategory = CatchAsync(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
    // console.log(req.params.id)
  
    if (!category) {
      return next(new AppError("Category not found!", 404));
    }
  
    const updatedCategory = await category.update(req.body);
    res.status(200).json({
      status: "success",
      message: "category Updated Successfully",
      updatedCategory,
    });
  });
  
  export const deleteCategory = CatchAsync(async (req, res) => {
    const category = await Category.findByPk(req.params.id);
  
    if (!category) {
      return next(new AppError("Category not found!", 404));
    }
  
    await category.destroy();
    res.status(200).json({
      status: "success",
      message: "Category Deleted Successfully",
    });
  });
  