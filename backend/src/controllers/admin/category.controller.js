import { handleCategoryError } from "../../utils/error.util.js";
import {
  createCategoryService,
  deleteCategoryByIdService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from "../../services/admin/category.service.js";

// GET/categories
const getCategories = async (req, res) => {
  try {
    let { limit, page } = req.query;

    if (limit !== undefined) {
      limit = Number(limit);
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        return res.status(400).json({
          success: false,
          message: "Limit phải là số dương và không vượt quá 100",
        });
      }
    }

    if (page !== undefined) {
      page = Number(page);
      if (isNaN(page) || page <= 0) {
        return res.status(400).json({
          success: false,
          message: "Page phải là số dương",
        });
      }
    }

    const result = await getAllCategoriesService(limit, page, req.query);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục thành công",
      pagination:
        limit && page
          ? {
              total: result.total,
              page: result.currentPage,
              limit: limit,
              totalPages: result.totalPages,
            }
          : { total: result.total },
      data: result.categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET/categories/id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Mongo ID
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const category = await getCategoryByIdService(id);

    if (category) {
      return res.status(200).json({
        success: true,
        data: category,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy danh mục với id: ${id}`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST/categories
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ name và slug",
      });
    }

    const newCategory = await createCategoryService({
      name,
      slug,
      description,
      order,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo danh mục thành công",
      data: newCategory,
    });
  } catch (error) {
    const { statusCode, message } = handleCategoryError(error);
    return res.status(statusCode).json({ success: false, message });
  }
};

// PUT/categories
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const existing = await getCategoryByIdService(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy danh mục với id: ${id}`,
      });
    }

    const { name, slug, description, order } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = order;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu để cập nhật",
      });
    }

    const updated = await updateCategoryService(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: updated,
    });
  } catch (error) {
    const { statusCode, message } = handleCategoryError(error);
    return res.status(statusCode).json({ success: false, message });
  }
};

// DELETE/categories/id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ",
      });
    }

    const existing = await getCategoryByIdService(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy danh mục với id: ${id}`,
      });
    }

    const deleted = await deleteCategoryByIdService(id);

    return res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công",
      data: deleted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
