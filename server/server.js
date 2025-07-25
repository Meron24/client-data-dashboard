
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); 
const User = require('./models/User');            

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Client Data Dashboard Backend is running');
});

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ alter: true }); // sync models with DB
    console.log('Models synced');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
}

start();
