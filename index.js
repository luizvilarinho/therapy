const express = require("express");

const app = express();
const mainRoutes = require('./routes/main');
const loginRoutes = require('./routes/login');
const cors = require("cors");


const port = process.env.PORT || 3000;

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Credentials', "*");
    res.header('Access-Control-Expose-Headers', 'x-access-token'); //essta linha habilita o token no header
    
    app.use(cors());
    next();
});

app.use('/terapia/v1/main', mainRoutes);
app.use('/terapia/v1/login', loginRoutes);


app.listen(port, ()=>{
    console.log(`terapia is working on port ${port}`)
})