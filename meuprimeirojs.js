var http = require('http');


var dt = require('./meuprimeiromodulo');



http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  // Retornar a parte do URL do objeto de solicitação
  res.write(req.url);
  
  res.write("Agora sao exatamente: " + dt.myDateTime());
  res.end(' Ola Mundo!');
}).listen(8080);