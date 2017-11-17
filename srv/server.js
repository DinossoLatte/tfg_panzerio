"use strict";
exports.__esModule = true;
var restify = require("restify");
function response_test(request, response, next) {
    response.send('test ' + request.params.name);
    next();
}
var server = restify.createServer();
server.get('/hello/:name', response_test);
server.head('/hello/:name', response_test);
server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});
//Importamos pusher (en la consola se instaló con npm install pusher)
var Pusher = require('pusher');

//Asignamos las claves que hacen referencia a nuestra cuenta de pusher
var pusher = new Pusher({
  appId: '432429',
  key: '2955e071f41e18e9805c',
  secret: '91c4c81ae35a8b22070a',
  cluster: 'eu',
  encrypted: true
});

//Creamos un canal con un evento cuyo parámetro es message (por defecto es hello world), se podrían añadir más parámetros
pusher.trigger('mychannel', 'myevent', {
  "message": "hello world"
});
