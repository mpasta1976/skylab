import bcrypt from 'bcryptjs';

import request from 'supertest';

import app from '../../src/app';

import truncate from '../util/truncate';

// import factory from '../factories';

import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Michel Augusto Pasta',
        email: 'michel.pasta@outlook.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should encrypt user password on user created', async () => {
    const userCreated = await User.create({
      name: 'Michel Augusto Pasta',
      email: 'michel.pasta@outlook.com',
      password: '123456',
    });

    // Segundo parametro atualiza propriedades do objeto criado na factory //
    // console.log(factory);

    // userCreated = await factory.create('User', {
    //   password: '123456',
    // });

    const compareHash = await bcrypt.compare(
      '123456',
      userCreated.password_hash
    );

    expect(compareHash).toBe(true);
  });

  it('should not register with duplicate email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Michel Augusto Pasta',
        email: 'michel.pasta@outlook.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Michel Augusto Pasta',
        email: 'michel.pasta@outlook.com',
        password: '123456',
      });
    expect(response.status).toBe(400);
  });
});
