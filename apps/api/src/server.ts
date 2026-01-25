import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_, res) => {
    res.json({ status: "still up" });
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log(`StillUp API running on port ${port}`)
  );
}
