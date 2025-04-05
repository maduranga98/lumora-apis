// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const dotenv = require("dotenv");

// // Load environment variables
// dotenv.config();

// // Import routes
// const authRoutes = require("./routes/auth");
// const servicesRoutes = require("./routes/services");
// const staffRoutes = require("./routes/staff");
// const bookingRoutes = require("./routes/booking");
// const leavesRoutes = require("./routes/leaves");

// // Initialize express app
// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(helmet()); // Security headers
// app.use(morgan("dev")); // Logging
// app.use(cors()); // Enable CORS
// app.use(bodyParser.json()); // Parse JSON request body
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/services", servicesRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/booking", bookingRoutes);
// app.use("/api/leaves", leavesRoutes);

// // Base route with API documentation
// app.get("/", (req, res) => {
//   res.json({
//     message: "Welcome to Salon API",
//     version: "1.0.0",
//     endpoints: {
//       auth: {
//         register: "POST /api/auth/register",
//         login: "POST /api/auth/login",
//         userDetails: "GET /api/auth/user/:uid",
//       },
//       services: {
//         getAllCategories: "GET /api/services/categories",
//         getCategoryById: "GET /api/services/category/:categoryId",
//         getServiceById:
//           "GET /api/services/category/:categoryId/service/:serviceId",
//         getAllServices: "GET /api/services/salon/:salonId",
//       },
//       staff: {
//         getStaffBySalon: "GET /api/staff/salon/:salonId",
//         getStaffById: "GET /api/staff/:staffId",
//       },
//       booking: {
//         getStaffBookings: "GET /api/booking/staff/:staffId",
//         createBooking: "POST /api/booking",
//         updateBookingStatus:
//           "PATCH /api/booking/staff/:staffId/booking/:bookingId",
//       },
//       leaves: {
//         getStaffLeaves: "GET /api/leaves/staff/:staffId",
//         createLeave: "POST /api/leaves",
//         updateLeaveStatus: "PATCH /api/leaves/staff/:staffId/leave/:leaveId",
//       },
//     },
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     error: "Something went wrong!",
//     message: err.message,
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const servicesRoutes = require("./routes/services");
const staffRoutes = require("./routes/staff");
const bookingRoutes = require("./routes/booking");
const leavesRoutes = require("./routes/leaves");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON request body
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger UI documentation route
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Salon API Documentation",
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/leaves", leavesRoutes);

// Base route - redirect to API documentation
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Salon API",
    version: "1.0.0",
    documentation: "/api-docs",
    description:
      "Visit /api-docs for interactive API documentation and testing",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
