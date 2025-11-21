import {
  getAllCategoriesService,
  getCategoryByIdService,
} from "../../services/public/category.service.js";

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

export { getCategories, getCategoryById };
