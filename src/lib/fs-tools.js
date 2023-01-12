import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");

const postsJSONPath = join(dataFolderPath, "blogPosts.json");
const authorsJSONPath = join(dataFolderPath, "authors.json");

export const getPosts = () => readJSON(postsJSONPath);
export const writePosts = (arr) => writeJSON(postsJSONPath, arr);

export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (arr) => writeJSON(authorsJSONPath, arr);

export const getJSONReadableStream = () => createReadStream(postsJSONPath);
