const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const categoryRoutes = require("./routes/Category");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 4001;

//database connect
database.connect();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin:process.env.NODE_ENV === "production" ? "*" : ["http://localhost:3000", "http://localhost:3001", "https://studynotion-tkes.onrender.com"],
		credentials:true,
	})
)

// Serve static files in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../build")));
}

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/category", categoryRoutes);

//def route
app.get("/", (req, res) => {
	if (process.env.NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "../build", "index.html"));
	} else {
		return res.json({
			success:true,
			message:'Your server is up and running....'
		});
	}
});

// Handle React Router - return index.html for any non-API routes
app.get("*", (req, res) => {
	if (process.env.NODE_ENV === "production") {
		res.sendFile(path.join(__dirname, "../build", "index.html"));
	}
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})

