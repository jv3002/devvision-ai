module.exports = {
  info: (msg) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${msg}`);
    }
  },
  warn: (msg) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${msg}`);
    }
  },
  error: (msg) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${msg}`);
    }
  }
};
