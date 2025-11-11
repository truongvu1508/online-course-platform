import Category from "../models/category.model.js";
import aqp from "api-query-params";
import {
  processPartialSearch,
  CATEGORY_SEARCHABLE_FIELDS,
} from "../utils/query.helper.js";

const selectedFields = "_id name slug description order ";

const getAllCategoriesService = async (limit, page, queryString) => {
  try {
    let result = null;

    if (limit && page) {
      const { filter } = aqp(queryString);

      delete filter.page;
      delete filter.limit;

      let offset = (page - 1) * limit;

      const processedFilter = processPartialSearch(
        filter,
        CATEGORY_SEARCHABLE_FIELDS
      );

      const [categories, totalCategories] = await Promise.all([
        Category.find(processedFilter)
          .select(selectedFields)
          .limit(limit)
          .skip(offset)
          .exec(),

        Category.countDocuments(processedFilter),
      ]);

      result = {
        categories,
        total: totalCategories,
        totalPages: Math.ceil(totalCategories / limit),
        currentPage: Number(page),
        pageSize: Number(limit),
      };
    } else {
      const categories = await Category.find({}).select(selectedFields).exec();

      result = {
        categories,
        total: categories.length,
      };
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const getCategoryByIdService = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId)
      .select(selectedFields)
      .exec();

    return category;
  } catch (error) {
    throw new Error("Không thể tải danh mục");
  }
};

const createCategoryService = async (CategoryData) => {
  try {
    const { name, slug, description, order } = CategoryData;

    const newCategory = await Category.create({
      name,
      slug,
      description,
      order,
    });

    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

const updateCategoryService = async (categoryId, dataUpdate) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { $set: dataUpdate },
      { new: true, upsert: false }
    ).select(selectedFields);

    return updated;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Lỗi server, không thể cập nhật danh mục");
  }
};

const deleteCategoryByIdService = async (categoryId) => {
  try {
    const deleted = await Category.deleteById({ _id: categoryId });
    return deleted;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Lỗi server, không thể xoá danh mục");
  }
};

export {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryByIdService,
};
