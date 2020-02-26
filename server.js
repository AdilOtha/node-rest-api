const http=require('http');
const app=require('./app');
const port=process.env.PORT || 3000;
const server=http.createServer(app);//create eventlistener for request
server.listen(port);//listen at port number 3000 for localhost