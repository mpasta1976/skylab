import {
  format,
  startOfDay,
  endOfDay,
  isAfter,
  setHours,
  setMinutes,
  setSeconds} from 'date-fns';
import {Op} from 'sequelize';

import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const {date} = req.query;

    if (!date) {
      res.status(400).json({error: 'Invalid Date'});
    }

    const searchDate = Number(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(searchDate),
            endOfDay(searchDate)
          ]
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    // Validar se ja passou a data
    // Validar se nao esta ocupado ainda
    const avaliable = schedule.map(time => {
      const[hour, minute] = time.split(':'); //quebra a hora e minuto
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
      console.log(value);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        avaliable:
          isAfter(value, new Date()) &&
          !appointments.find(a => {
              format(a.date, 'HH:mm') === time
          }),
      }
    });

    return res.json({
      avaliable,
      appointments
    });
  }
}

export default new AvailableController();
