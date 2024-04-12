import "dotenv/config";
import express from 'express';
import deployRouter from './routes/deploy';
import bidsRouter from './routes/bids';

const app = express();
const port = 3001;

app.use(express.json());

app.use('/deploy', deployRouter);
app.use('/bids', bidsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
