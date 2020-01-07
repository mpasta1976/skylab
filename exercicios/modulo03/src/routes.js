import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import User from './app/models/User';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', (req, res) =>
  res.json({
    Message: 'Rocket Seat',
  })
);

routes.get('/CI', (req, res) => res.send('Ok 3'));

routes.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

routes.post('/users', UserController.store);
// SessionController - Criando sessao //
routes.post('/sessions', SessionController.store);

// Todos os itens para baixo usando a autenticacao//
routes.use(authMiddleware);

// Atualizacao de usuario
routes.put('/users', UserController.update);

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

// Subir arquivos //
routes.post('/files', upload.single('file'), FileController.store);

// Prestadores de Servicos //
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedules', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
