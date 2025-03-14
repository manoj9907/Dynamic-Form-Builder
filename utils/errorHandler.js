const createError = (status, message, details = null) => {
  const error = new Error(message);
  error.status = status;
  error.timestamp = new Date().toISOString();
  error.details = details
    ? Array.isArray(details)
      ? details
      : [details]
    : null;
  return error;
};

module.exports = createError;
