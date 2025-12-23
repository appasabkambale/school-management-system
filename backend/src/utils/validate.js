exports.requireFields = (fields, body) => {
  const missing = fields.filter((field) => !body[field]);

  if (missing.length > 0) {
    const error = new Error(
      `Missing required fields: ${missing.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }
};
