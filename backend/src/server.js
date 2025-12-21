import dotenv from "dotenv";
import { initializeCronJobs} from "./utils/cronJobs.js"
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect database
connectDB();
initializeCronJobs();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
