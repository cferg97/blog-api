import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import json2csv from "json2csv";
import { pipeline } from "stream";
import {
  getJSONReadableStream,
  getPosts,
  writePosts,
} from "../lib/fs-tools.js";
import { getPDFReadableStream } from "../lib/pdf-tools.js";

const postsRouter = express.Router();

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.send(posts);
  } catch (err) {
    next(err);
  }
});

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = {
      ...req.body,
      id: uniqid(),
      author: {
        ...req.body.author,
        avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`,
      },
      createdAt: new Date(),
    };
    const posts = await getPosts();
    posts.push(newPost);
    await writePosts(posts);
    res.status(201).send({ id: newPost.id });
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/CSV", async (req, res, next) => {
  try {
    const source = await getJSONReadableStream();
    res.setHeader("Content-Disposition", "attachment; filename=posts.csv");
    const transform = new json2csv.Transform({
      fields: ["id", "title", "author.name", "category", "content"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/:postid", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const match = posts.find((post) => post.id === req.params.postid);
    res.send(match);
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/pdf/:postid", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogposts.pdf");
    const posts = await getPosts();
    const post = posts.find((p) => p.id === req.params.postid);
    const source = getPDFReadableStream(post);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    next(err);
  }
});

postsRouter.delete("/:postid", async (req, res, next) => {
  try {
    const posts = await getPosts();
    const remainingPosts = posts.filter(
      (post) => post.id !== req.params.postid
    );
    await writePosts(remainingPosts);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
export default postsRouter;
