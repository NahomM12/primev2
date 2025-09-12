const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const rabbitMQService = require("./services/rabbitMQService");
const notificationMessageBroker = require("./services/notificationMessageBroker");
const webSocketService = require("./services/webSocketService");
const authRouter = require("./routes/authRoutes");
const adminRouter = require("./routes/adminRoutes");
const managerRouter = require("./routes/managerRoutes");
const propertyTypeRouter = require("./routes/propertyTypeRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const propertyRouter = require("./routes/propertyRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const locationRouter = require("./routes/locationRoutes");
const regionRouter = require("./routes/regionRoutes");
const subRegionRouter = require("./routes/subRegionRoutes");
const paymentRouter = require("./routes/paymentRoute");
const notificationRouter = require("./routes/notificationRoutes");
// const User = require("./models/userModel");
// const Manager = require("./models/managerModel");
const PORT = process.env.PORT || 9001;
// const { Property } = require("./models/propertyModel");
// const User = require("./models/userModel");

connectDB();
app.use(morgan("dev"));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:8081",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/manager", managerRouter);
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/property-type", propertyTypeRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/transaction", transactionRouter);
app.use("/api/v1/region", regionRouter);
app.use("/api/v1/subregion", subRegionRouter);
app.use("/api/v1/location", locationRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/notification", notificationRouter);

// const updateUsers = async () => {
//   try {
//     // Update all users to add the new properties field
//     await Manager.updateMany({}, { $set: { refershToken: "" } }); // Initialize properties as an empty array

//     console.log("All users have been updated successfully.");
//   } catch (error) {
//     console.error("Error updating users:", error);
//   }
// };
// updateUsers();

app.use(notFound);
app.use(errorHandler);

const initializeServices = async () => {
  try {
    // Initialize RabbitMQ connection
    await rabbitMQService.initialize();
    console.log('RabbitMQ service initialized successfully');
    
    // Initialize notification message broker
    await notificationMessageBroker.initialize();
    console.log('Notification message broker initialized successfully');
    
    // Start the server after services are initialized
    server.listen(PORT, () => {
      console.log(`HTTP server running on port ${PORT}`);
      
      // Initialize WebSocket service with the HTTP server
      webSocketService.initialize(server);
    });
  } catch (error) {
    console.error('Failed to initialize services:', error);
    process.exit(1);
  }
};

// Start the application with all required services
initializeServices();
