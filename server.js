import express from "express";
import router from "./api/routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json({ limit: "10mb" }));
app.use("/api/v1/cbs", router);
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);
// app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

// configure environment variables
dotenv.config();

// db config
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Started up at port ${port}`);
    });
  });

export default app;
