const express = require("express");

const app = express();
var bodyParser = require("body-parser");
const mainRoutes = require('./routes/main');

const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '5mb' }));

app.use('/terapia/v1/main', mainRoutes);

app.listen(port, ()=>{
    console.log(`terapia is working on port ${port}`)
})