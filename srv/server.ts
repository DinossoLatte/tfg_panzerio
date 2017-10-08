import * as restify from 'restify';

function response_test(request, response, next) {
    response.send('test ' + request.params.name);
    next();
}

var server = restify.createServer();
server.get('/hello/:name', response_test);
server.head('/hello/:name', response_test);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
