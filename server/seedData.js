const mongoose = require("mongoose");
const Category = require("./models/Category");
const Course = require("./models/Course");
const User = require("./models/User");
require("dotenv").config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");

    // Clear existing data
    await Category.deleteMany({});
    await Course.deleteMany({});
    console.log("Existing data cleared");

    // Get instructor user
    const instructor = await User.findOne({ accountType: "Instructor" });
    if (!instructor) {
      console.log("No instructor found. Please create an instructor account first.");
      return;
    }

    // Create categories
    const categories = await Category.create([
      {
        name: "Web Development",
        description: "Learn modern web development technologies",
      },
      {
        name: "Mobile Development", 
        description: "Build native and cross-platform mobile apps",
      },
      {
        name: "Data Science",
        description: "Master data analysis and machine learning",
      },
      {
        name: "UI/UX Design",
        description: "Create beautiful user interfaces and experiences",
      }
    ]);

    console.log("Categories created:", categories.length);

    // Create courses
    const courses = await Course.create([
      {
        courseName: "Complete React Developer Course",
        courseDescription: "Learn React from scratch and build modern web applications",
        instructor: instructor._id,
        whatYouWillLearn: "React, Redux, Hooks, Context API, and modern development practices",
        price: 8999,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
        tag: ["React", "JavaScript", "Web Development"],
        category: categories[0]._id,
        status: "Published",
        studentsEnrolled: [],
        courseContent: [],
        ratingAndReviews: [],
        instructions: [
          "Watch videos in order",
          "Complete all assignments",
          "Build projects"
        ]
      },
      {
        courseName: "Node.js Backend Development",
        courseDescription: "Master server-side JavaScript with Node.js and Express",
        instructor: instructor._id,
        whatYouWillLearn: "Node.js, Express, MongoDB, Authentication, and REST APIs",
        price: 7999,
        thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
        tag: ["Node.js", "Express", "Backend", "MongoDB"],
        category: categories[0]._id,
        status: "Published",
        studentsEnrolled: [],
        courseContent: [],
        ratingAndReviews: [],
        instructions: [
          "Install Node.js and VS Code",
          "Follow along with coding exercises",
          "Build real projects"
        ]
      },
      {
        courseName: "React Native Mobile Apps",
        courseDescription: "Build cross-platform mobile applications with React Native",
        instructor: instructor._id,
        whatYouWillLearn: "React Native, Navigation, State Management, and Mobile Development",
        price: 9999,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
        tag: ["React Native", "Mobile", "iOS", "Android"],
        category: categories[1]._id,
        status: "Published",
        studentsEnrolled: [],
        courseContent: [],
        ratingAndReviews: [],
        instructions: [
          "Setup development environment",
          "Learn React Native fundamentals",
          "Build mobile apps"
        ]
      },
      {
        courseName: "Python for Data Science",
        courseDescription: "Learn Python programming for data analysis and machine learning",
        instructor: instructor._id,
        whatYouWillLearn: "Python, NumPy, Pandas, Matplotlib, and Machine Learning basics",
        price: 10999,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
        tag: ["Python", "Data Science", "Machine Learning"],
        category: categories[2]._id,
        status: "Published",
        studentsEnrolled: [],
        courseContent: [],
        ratingAndReviews: [],
        instructions: [
          "Install Python and Jupyter",
          "Learn Python basics",
          "Practice with datasets"
        ]
      },
      {
        courseName: "UI/UX Design Fundamentals",
        courseDescription: "Master the principles of user interface and user experience design",
        instructor: instructor._id,
        whatYouWillLearn: "Design principles, Figma, prototyping, and user research",
        price: 6999,
        thumbnail: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
        tag: ["UI Design", "UX Design", "Figma", "Prototyping"],
        category: categories[3]._id,
        status: "Published",
        studentsEnrolled: [],
        courseContent: [],
        ratingAndReviews: [],
        instructions: [
          "Learn design principles",
          "Master Figma tools",
          "Create design projects"
        ]
      }
    ]);

    console.log("Courses created:", courses.length);

    // Update categories with course references
    await Category.findByIdAndUpdate(categories[0]._id, {
      $push: { courses: [courses[0]._id, courses[1]._id] }
    });

    await Category.findByIdAndUpdate(categories[1]._id, {
      $push: { courses: courses[2]._id }
    });

    await Category.findByIdAndUpdate(categories[2]._id, {
      $push: { courses: courses[3]._id }
    });

    await Category.findByIdAndUpdate(categories[3]._id, {
      $push: { courses: courses[4]._id }
    });

    console.log("Categories updated with course references");
    console.log("✅ Seed data completed successfully!");

  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected");
  }
};

// Run the seed function
seedData();
