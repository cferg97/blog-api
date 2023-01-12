import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandler.js";
import * as dotenv from "dotenv";
import authorsRouter from "./authors/index.js";
import postsRouter from "./posts/index.js";

dotenv.config();

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.use("/authors", authorsRouter);
server.use("/blogposts", postsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
