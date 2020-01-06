import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, subHours, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Queue from '../lib/Queue';

import CancellationMail from '../jobs/CancellationMail';

import Notification from '../schemas/Notification';

import generalConfig from '../../config/general';

class AppointmentController {
  async index(req, res) {
    // Paginacao //
    const { page = 1 } = req.query;
    const { pag_limit = 20 } = generalConfig; // Se nao tiver uma configuracao, seta para 20

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      attributes: ['id', 'date', 'past', 'cancelable'],
      order: ['date'],
      limit: pag_limit, // Quantos itens ira trazer //
      offset: (page - 1) * pag_limit, // Em qual pagina esta //
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { provider_id, date } = req.body;

    /*
    Check if provider id is provider
    */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appoitments with providers' });
    }

    /*
    Validar se data eh passada
    */
    const hoursStart = startOfHour(parseISO(date));

    if (isBefore(hoursStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /*
    Validar se a data ja esta agendada para este provider
    */
    const checkAvail = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hoursStart },
    });

    if (checkAvail) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /*
    Notify appointment provider
    */
    const user = await User.findByPk(req.userId);

    const formatedDate = format(
      hoursStart,
      "'dia' dd 'de' MMMM, 'as' H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    /*if (appointment.user_id !== res.userId) {
      return res.status(401).json({
        error: "You don't have access to cancel this appointment",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    // A data atual eh inferior a 2 horas //
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointment with 2 hours in advance',
      });
    }*/

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
