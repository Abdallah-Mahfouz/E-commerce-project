import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("config/.env") });
import express from "express";
import { initApp } from "./Src/initApp.js";
//================================================
const app = express();
//================================================

// app.set("case sensitive routing", true);
initApp(app, express);
