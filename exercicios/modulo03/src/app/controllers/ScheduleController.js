import {startOfDay, endOfDay, parseISO} from 'date-fns';
import {Op} from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';


class ScheduleController {
  async index(req, res) {
    const {userId} = req;

    const checkUserProvider = await User.findOne({where: {
      id: userId, provider: true
    }});

    if (!checkUserProvider) {
      return res.status(401).json('User does not have access');
    }

    const {date} = req.query;
    const parsedDate = parseISO(date);

    const schedules = await Appointment.findAll({
      where: {
        provider_id : userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parsedDate),
            endOfDay(parsedDate)
          ]
        }},
      attributes: ['id', 'date'],
      order: ['date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
          include: [{
            model: File,
            as: 'avatar',
            attributes: ['id', 'url'],
          }],
        }
      ]
    })

    return res.json(schedules);

  }

}

export default new ScheduleController();
