import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const authorSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name is a mandatory field",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "surname is a mandatory field",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "email is a mandatory field.",
    },
  },
  dob: {
    in: ["body"],
    isString: {
      errorMessage: "Date of birth is a mandatory field",
    },
  },
};

export const checkAuthorSchema = checkSchema(authorSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Error during post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
