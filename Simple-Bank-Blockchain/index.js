const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3000;

const server = http.createServer(function(req,res){
    // res.write('Hello Node')
    // res.end()
    res.writeHead(200, {'Content-Type':'text/html'})
    fs.readFile('index.html',function(error, data){
        if(error){
            res.writeHead(404)
            res.write('Error: File Not found')
        }else{
            res.write(data)
        }
        res.end()
    })



})

server.listen(port,function(error){
    if(error){
        console.log('something went wrong', error);
    }else{
        console.log('Server is listening on the port '+port);
    }

})