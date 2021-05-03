const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODOS OS CLIENTES
router.get('/', (req, res, next) =>{
      
    mysql.getConnection((error, conn)=> {
        if (error) { return res.status(500).send({error: error}) }
        conn.query(
            'SELECT id_cpf, nome, email FROM clientes',
            (error, resultado, fields)=> {
                conn.release();

                if (error) { return res.status(500).send({error: error}) }
                return res.status(200).send({response: resultado})

            }
        )   
    });
});

//RETORNA OS DADOS DE UM CLIENTE
router.get('/:cpf', (req, res, next)=> {
    const idcpf = req.params.cpf

    mysql.getConnection((error, conn)=> {
        conn.query(
            'SELECT id_cpf, nome, email FROM clientes WHERE id_cpf = ?',
            [idcpf],
            (error, resultado, field)=> {
                conn.release();
                
                if (error) {
                    res.status(500).send( {
                        error : error,
                        response: null
                    });
                } 

                res.status(200).send( {
                    mensagem:  'Cliente encontrado com sucesso',
                    idcpf: idcpf.match
                })
            }
        )   
    }); 
});

//INSERINDO UM CLIENTE 

router.post('/new',(req, res, next) => {
    
    const cliente = {
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf
    };

    if (!cliente.nome) {
        res.status(400).send( {
            mensagem: 'Nome não preenchido',
            nomeinvalido: cliente.nome
        })
    }
     
    if (!cliente.email) {
        res.status(400).send( {
            mensagem: 'Email não preenchido',
            emailinvalido: cliente.email
        })
    }
     
    if (!cliente.cpf) {
        res.status(400).send( {
            mensagem: 'CPF não preenchido',
            cpfinvalido: cliente.cpf
        })
    }

    mysql.getConnection((error, conn) => {
        conn.query(
            'INSERT INTO clientes (id_cpf, nome, email) VALUES (?,?,?)',
            [cliente.cpf, cliente.nome, cliente.email],
            (error, resultado, field) => {
                conn.release();
                
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(400).send({
                        mensagem: 'Cliente já cadastrado na base',
                        id_cpf: cliente.cpf
                    });
                }    

                if (error) {
                    res.status(500).send({
                        mensagem: 'Erro ao executar consulta',
                        id_cpf: cliente.cpf
                    });
                }    

                res.status(201).send({
                    mensagem: 'Cliente criado com sucesso',
                    id_cpf: cliente.cpf
                });
            }
        )
    });
});

//ATUALIZANDO DADOS EMAIL E NOME
router.put('/update',(req, res, next) => {
    
    const cliente = {
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf
    };

    if (!cliente.nome) {
        res.status(400).send( {
            mensagem: 'Nome não preenchido',
            nomeinvalido: cliente.nome
        })
    }
     
    if (!cliente.email) {
        res.status(400).send( {
            mensagem: 'Email não preenchido',
            emailinvalido: cliente.email
        })
    }
     
    if (!cliente.cpf) {
        res.status(400).send( {
            mensagem: 'CPF não preenchido',
            cpfinvalido: cliente.cpf
        })
    }
    
    mysql.getConnection((error, conn) => {
        conn.query(
            'UPDATE clientes SET nome = (?), email = (?) WHERE id_cpf = ?',
            [cliente.nome, cliente.email, cliente.cpf], 
            (error, resultado, field) => {
                conn.release();

                if (resultado.affectedRows === 0) {
                    res.status(500).send({
                        mensagem: 'Cliente não encontrado na base para atualização',
                        id_cpf: cliente.cpf
                    });
                } else {
                    res.status(200).send({
                        mensagem: 'Cliente alterado com sucesso',
                        idcpf : cliente
                    }); 
                }    
            }
        )
    });
});

router.delete('/delete/:cpf', (req, res, next)=> {
    const idcpf = req.params.cpf

    mysql.getConnection((error, conn)=> {
        conn.query(
            'DELETE from minutrade.clientes WHERE id_cpf = ?',
            [idcpf],
            (error, resultado, field)=> {
                conn.release();
                
                if (resultado.affectedRows === 0) {
                    res.status(500).send( {
                        mensagem : 'CPF não encontrado na base para realizar exclusão',
                        idcpf: idcpf
                    });
                } else {
                    res.status(200).send( {
                        mensagem:  'Cliente excluido com sucesso',
                        idcpf: resultado
                    })
                } 
            }
        )   
    }); 
});

module.exports = router;
