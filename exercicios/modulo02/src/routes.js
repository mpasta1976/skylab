import { Router } from 'express';
import User from './app/models/User';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) =>
  res.json({
    Message: 'Rocket Seat',
  })
);

routes.get('/user', async (req, res) => {
  try {
    const user = await User.create({
      name: 'Michel A. Pasta',
      email: 'michel.pasta@outlook.com',
      password_hash: '12345676543456',
    });

    return res.json(user);
  } catch (error) {
    return res.json(error.errors);
  }
});

routes.post('/users', UserController.store);
// SessionController - Criando sessao //
routes.post('/sessions', SessionController.store);

// Todos os itens para baixo usando a autenticacao//
routes.use(authMiddleware);

// Atualizacao de usuario
routes.put('/users', authMiddleware, UserController.update);

export default routes;
