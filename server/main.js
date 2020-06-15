const routerApi = require('./router');
const express = require('express');
const bodyParser = require("body-parser")
const schedule = require("node-schedule");
const app = express();
const mysql = require('mysql');
const WebSocket = require('ws');

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

//每月第一天在数据库新建一个上个月的字段
let date = new Date();
let lastMonth = date.getMonth();
if (lastMonth >= 1 && lastMonth <= 9) {
	lastMonth = "0" + lastMonth;
}
column = 'month' + date.getFullYear() + lastMonth;
schedule.scheduleJob('0 0 0 1 * *',()=>{
	var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'cnaiq1988',
			database : 'myDbs',
			port: '3306',
			dateStrings: true,
			multipleStatements: true
		});
	var  sql = 'ALTER TABLE myDbs_userconfig ADD ' + column +  " float (50) NOT NULL DEFAULT '0'";
	connection.connect();       
	connection.query(sql, function (error, result) {
		if (error) throw error;
		console.log(result);
		connection.end();
	});	
});

schedule.scheduleJob('0 0 0 * * *',()=>{
	var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'cnaiq1988',
			database : 'myDbs',
			port: '3306',
			dateStrings: true,
			multipleStatements: true
		});
	var  sql = 'TRUNCATE TABLE qcui_registerPatient';
	connection.connect();       
	connection.query(sql, function (error, result) {
		if (error) throw error;
		console.log(result);
		connection.end();
	});
	//todo 遍历当天免煎处方，修改药品
});

app.listen(3000,() => {
    console.log('app listening on port 3000.')
})

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 8081
});

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        /* ws.send(`kkkkkkk`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
		}); */
		wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
			  client.send('afafa');
			}
		})
    })
});



