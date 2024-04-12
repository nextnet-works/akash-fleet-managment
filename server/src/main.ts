import "dotenv/config";
import express from "express";

const app = express();
const port = 3001;

app.listen(port, async () => {
  try {
    console.log(`Server running on port ${port}`);
  } catch (error: any) {
    console.error("Error: " + error);
  }
});
