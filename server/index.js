const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");

dotenv.config();

const analyzeImage = require("./routes/analyze");
const loginRoute = require("./routes/login");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.raw({ type: "application/octet-stream", limit: "5mb" }));

// Routes
app.use("/login", loginRoute);
app.use("/analyze", analyzeImage);

// Analytics file
const analyticsFile = "./analytics.json";
let analytics = { messages: 0, imagesAnalyzed: 0 };

// SO
