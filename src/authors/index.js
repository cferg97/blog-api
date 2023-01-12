import express from "express";
import { getAuthors, writeAuthors } from "../lib/fs-tools.js";
import uniqid from "uniqid";
import { checkAuthorSchema, triggerBadRequest } from "./validator.js";

const authorsRouter = express.Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.status(200).send(authors);
  } catch (err) {
    next(err);
  }
});

authorsRouter.post(
  "/",
  checkAuthorSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      const newAuthor = {
        ...req.body,
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
        id: uniqid(),
        createdAt: new Date(),
      };
      const authors = await getAuthors();
      const results = authors.find((author) => author.email === req.body.email);
      if (!results) {
        authors.push(newAuthor);
        await writeAuthors(authors);
        res.status(201).send(newAuthor);
      } else {
        res.send("Email in use, cannot add author.");
      }
    } catch (err) {
      next(err);
    }
  }
);

authorsRouter.get("/:authorid", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const match = authors.find((author) => author.id === req.params.authorid);
    res.send(match);
  } catch (err) {
    next(err);
  }
});

authorsRouter.put("/:authorid", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const index = authors.findIndex(
      (author) => author.id === req.params.authorid
    );
    const oldAuthor = authors[index];
    const updatedAuthor = {
      ...oldAuthor,
      ...req.body,
      updatedAt: new Date(),
      avatar:
        req.body.name && req.body.surname
          ? `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
          : `https://ui-avatars.com/api/?name=${oldAuthor.name}+${oldAuthor.surname}`,
    };
    authors[index] = updatedAuthor;
    await writeAuthors(authors);
    res.send(updatedAuthor);
  } catch (err) {
    next(err);
  }
});

authorsRouter.delete("/:authorid", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (author) => author.id !== req.params.authorid
    );
    await writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default authorsRouter;
