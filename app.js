import express from "express";
import logger from "morgan";
import cors from "cors";

import { router } from "./routes/api/contacts.js";
import { userRouter } from "./routes/api/users.js";
import passport from "./config/config-passport.js";

export const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", router);
app.use("/api/users", userRouter);
app.use(passport.initialize());
app.use(express.static("public"));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
