const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000;
const indexPath = path.join(__dirname, 'index.html');

const server = http.createServer(function(req,res){
    if (req.url !== '/') {
        res.writeHead(404, {'Content-Type': 'text/plain'})
        res.end('Not found')
        return
    }

    fs.readFile(indexPath,function(error, data){
        if(error){
            res.writeHead(500, {'Content-Type': 'text/plain'})
            res.end('Error: File could not be loaded')
        }else{
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
            res.end(data)
        }
    })



})

server.listen(port,function(error){
    if(error){
        console.log('something went wrong', error);
    }else{
        console.log('Server is listening on the port '+port);
    }

})