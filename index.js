const express = require("express");

const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
const mainRoutes = require('./routes/main');
const loginRoutes = require('./routes/login');


const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use('/terapia/v1/main', mainRoutes);
app.use('/terapia/v1/login', loginRoutes);


app.listen(port, ()=>{
    console.log(`terapia is working on port ${port}`)
})