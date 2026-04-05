const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID: ", categoryId);
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: { $ne: "Draft" } },
          populate: [
            { path: "ratingAndReviews" },
            { path: "instructor" },
          ],
        })
        .exec()
  
      // Fallback: if category->courses array is not maintained, fetch by Course.category
      if (selectedCategory?.courses?.length === 0) {
        const coursesByCategory = await Course.find({
          category: categoryId,
          status: { $ne: "Draft" },
        })
          .populate("ratingAndReviews")
          .populate("instructor")
          .exec()

        selectedCategory.courses = coursesByCategory
      }

      //console.log("SELECTED COURSE", selectedCategory)
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      
      // Get a random category from the remaining categories
      const randomIndex = getRandomInt(categoriesExceptSelected.length)
      const randomCategoryId = categoriesExceptSelected[randomIndex]?._id
      
      let differentCategory = null
      if (randomCategoryId) {
        differentCategory = await Category.findById(randomCategoryId)
          .populate({
            path: "courses",
            match: { status: { $ne: "Draft" } },
            populate: [
              { path: "ratingAndReviews" },
              { path: "instructor" },
            ],
          })
          .exec()
      }
      
      if (differentCategory?.courses?.length === 0) {
        const coursesByCategory = await Course.find({
          category: differentCategory?._id,
          status: { $ne: "Draft" },
        })
          .populate("ratingAndReviews")
          .populate("instructor")
          .exec()

        differentCategory.courses = coursesByCategory
      }
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: { $ne: "Draft" } },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }