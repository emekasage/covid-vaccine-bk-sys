import express from "express";
import router from "./api/routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "build")));
app.use("/api/v1/cbs", router);
app.use(express.json({ limit: "10mb" }));
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);
// app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

app.listen(port, (_) => {
  console.log(`server started on port ${port}`);
});

export default app;
