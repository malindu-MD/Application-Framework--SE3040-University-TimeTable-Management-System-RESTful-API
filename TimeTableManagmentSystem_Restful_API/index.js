const express = require("express");
const dbConnect = require("./config/dbConnect");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

const authRouter = require("./routes/authRoute");
const courseRouter = require("./routes/courseRoute");
const roomRouter = require("./routes/roomRoute");
const resourceRouter = require("./routes/resourceRoute");
const bookingRouter = require("./routes/bookingRoute");
const timeTableSessionRouter = require("./routes/timeTableSessionRoute");
const courseEnrollmentRouter = require("./routes/courseEnrollmentroute");

const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const {
  sendNotificationToAllEnrolledStudents,
} = require("./service/notificationService");

//call for database connected
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/user", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/room", roomRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/timetablesession", timeTableSessionRouter);
app.use("/api/courseenrollment", courseEnrollmentRouter);

app.use(notFound);
app.use(errorHandler);

// Configure server on port number 5000
app.listen(PORT, () => {
  console.log(`Server is running at PORT : ${PORT}`);
});
