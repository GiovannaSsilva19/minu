//Inmortação do http no projeto
const http = require('http');

//Variável criada para importação do app.js dentro do server
const app = require('./app')

//Variável para armazenar a porta do serviço
const port = process.env.PORT || 3000;

//Criando método create server, passando app dentro do server e escutando na porta
const server = http.createServer(app);

//ao digitar localhost:3000 ele irá entender que este é o serviço procurado
server.listen(port);

