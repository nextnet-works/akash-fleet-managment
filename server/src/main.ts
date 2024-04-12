import "dotenv/config";
import express from "express";
import cors from "cors";
import deployRouter from "./routes/deploy";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/deploy", deployRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
