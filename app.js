const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const rotaClientes = require('./routes/clientes');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json()); // json de entrada no body

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/clientes', rotaClientes);

 app.use((req, res, next)=>{
     const error = new Error('Rota não encontrada');
     error.status = 404;
     next(error);
 });

 app.use((error, req, res, next) =>{
     res.status(error.status || 500);
     return res.send({
         erro: {
             mensagem: error.message
         }
     });
 });

 module.exports = app;