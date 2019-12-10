const express = require('express');

const server = express();


// Para entender
server.use(express.json());

//Params
//  Query = ?teste=1
//  Route = users/1
//  Body = {"name"="teste"}

const users = ['Diego', 'Claudio', 'Victor'];

// Middleware //
// Utilizado para LOGS //
// Validaçao de acesso //
server.use((req, res, next)  => {
  console.time('Request');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User not found in params'});
  }

  return next();
}

function checkUserInList(req, res, next) {
  const user = users[req.params.index];
  if(!user) {
    return res.status(400).json({error: 'User does not exists'});
  }

  req.user = user;

  return next();      
}
 
server.get('/teste', (req, res) => {

  const nome = req.query.nome;

  return res.json({message: `Hello ${nome}`});
});

// Route Param = com `:` para identificar o parametro
// server.get('/users/:id', (req, res) => {
//   //Com a propriedade//
//   // const id = req.params.id;

//   //Desestruturado
//   const {id} = req.params;

//   return res.json({message: `Buscando o usuario (desestruturado): ${id}`});
// });

// Route Param = com `:` para identificar o parametro
server.get('/users/:index', checkUserInList, (req, res) => {
  //Com a propriedade//
  // const id = req.params.id;

  //Desestruturado
 // const {index} = req.params;

  //return res.json(users[index]);

  return res.json(req.user);
});

// Lista todos os usuarios //
server.get('/users', (req, res) => {
  return res.json(users);
});

server.post('/users', checkUserExists, (req, res) => {
  const {name} = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/users/:index', checkUserExists, checkUserInList, (req, res) => {
  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete('/users/:index', checkUserInList, (req, res) => {
  const {index} = req.params;

  users.splice(index, 1);

  return res.send();

});

//Body 


server.listen(3000);