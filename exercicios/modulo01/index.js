const express = require('express');

const server = express();

server.use(express.json());

// Query Params = ?teste=1
// Route Params = /users/1
// Qequest body = {name:1, idade:32}

server.get('/teste', (req,res) => {
  //console.log(req);
  //return res.send('Olá');
  const nome = req.query.nome;

  return res.json({message: `hello ${nome}`});
  
})

const users = ['Diego', 'Robson', 'Vitor'];

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  //return next();
  next();

  console.timeEnd('Request');
})

function checkUserExists(req, res, next ) {
  if (!req.body.name) {
    return res.status(400).json({error: "User not found in body!"});
  }

  return next();
}

function checkIndexExists(req, res, next) {
  const user = users[req.params.index];
  
  if (!user) {
    return res.status(400).json({error: "Usuario nao existe"});
  }

  req.user = user;

  return next();
}

server.get('/users', checkIndexExists, (req, res) => {
  return res.json(users);
})

server.get('/users/:index', checkIndexExists, (req,res) => {
  //console.log(req);
  //return res.send('Olá');
  //const id = req.params.id;
  
  //const {index} = req.params;
//return res.json(users[index]); 
return res.json(req.user); 
})

server.post('/users', checkUserExists, (req, res) => {
  const {name} = req.body;
  //console.log(name);
  users.push(name);

  return res.json(users);

})

server.put('/users/:index', checkUserExists, checkIndexExists, (req, res) => {
  const {name} = req.body;
  const {index} = req.params;

  users[index] = name;

  return res.json(users); 
})

server.delete('/users/:index', checkIndexExists, (req, res) => {
  const {index} = req.params;

  users.splice(index, 1);

  //return res.json(users);
  return res.send();
})

server.listen(3001);