CREATE SCHEMA `minutrade` ;

CREATE TABLE `minutrade`.`clientes` (
  `id_cpf` CHAR(11) NOT NULL COMMENT 'O CPF será a chave principal para identificar os clientes na base da Minu',
  `nome` VARCHAR(100) NOT NULL COMMENT 'Atributo para identificar o nome do cliente',
  `email` VARCHAR(100) NOT NULL COMMENT 'Atributo para identificação do email do cliente',
  PRIMARY KEY (`id_cpf`));
