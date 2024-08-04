const dataMethod = ["body", "query", "params", "headers", "file", "files"];
//================================================
export const validation = (schema) => {
  return (req, res, next) => {
    let arrayError = [];
    dataMethod.forEach((Key) => {
      if (schema[Key]) {
        const data = schema[Key].validate(req[Key], {
          abortEarly: false,
        });
        if (data.error) {
          //   arrayError.push(data.error.details);    ====> // for give array of error and all details
          data.error.details.forEach((err) => {
            arrayError.push(err.message);
          });
        }
      }
    });
    if (arrayError.length) {
      return res
        .status(400)
        .json({ msg: "validation error", errors: arrayError });
    }
    next();
  };
};
