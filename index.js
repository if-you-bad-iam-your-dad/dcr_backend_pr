const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();



// routes files

const userRoute = require('./admin/routes/userRoute');
const dataRoute = require('./admin/routes/dataRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/auth/api', userRoute);
app.use('/auth/data', dataRoute);




const port = process.env.PORT 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => {
  res.send('Welcome to project safe nammkal ');
});



