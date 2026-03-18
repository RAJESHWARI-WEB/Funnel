import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import searchRoutes from './routes/search';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

app.use('/api/search', searchRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
