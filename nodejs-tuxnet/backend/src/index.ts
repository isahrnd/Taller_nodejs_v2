import express from "express";
import {db} from './config/connectionDB';
import { apiRouter } from './routes/index';
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Guard for Node 20+ only; in older Node versions this is undefined
// In cloud, environment variables are injected by the platform
if (typeof (process as any).loadEnvFile === 'function') {
  (process as any).loadEnvFile();
}

app.use(express.json());

const port = process.env.PORT || 3000 ;

app.get("/", (req, res) => {
  res.send("Osejo Was Here");
});


app.use('/api/', apiRouter);

export default app;

db.then ( () => 
    app.listen(port, ()=> {
        console.log(`Server is running on port ${port}`);
    })
);

