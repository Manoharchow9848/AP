import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectdb from './db/mongodb.js';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js';
import districtRoutes from './routes/district.route.js'
import mlaRoutes from './routes/mla.route.js'
import mandalRoutes from './routes/mandal.route.js'
import path from 'path';
dotenv.config();
const __dirname = path.resolve();
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user',userRoutes);
app.use('/api',districtRoutes);
app.use('/api/mla',mlaRoutes);
app.use('/api/leader',mandalRoutes);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});
const port = 3000;

connectdb().then(()=>{
    app.listen(port,()=>{
        console.log(`app running on port ${port}`);
    })
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });