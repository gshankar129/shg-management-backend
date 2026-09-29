import "dotenv/config";

import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// Only spin up the HTTP listener during local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export default app for Vercel Serverless runtime

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;