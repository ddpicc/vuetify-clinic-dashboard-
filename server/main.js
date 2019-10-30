const routerApi = require('./router');
const express = require('express');
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all("*",(req,res,next) => {
    res.header("Access-Control-Allow-Credentials", "ture");
    res.header("Access-Control-Allow-Origin", req.header.origin);
    res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,Option");
    res.header("Access-Control-Allow-Headers", "Content-Type,username");
    next();
});

// 后端api路由
app.use('/api', routerApi);

app.listen(3000,() => {
    console.log('app listening on port 3000.')
})


