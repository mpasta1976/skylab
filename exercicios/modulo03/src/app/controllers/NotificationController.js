import Notification from '../schemas/Notification';

import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUserProvider) {
      return res.status(401).json('Only providers can load notifications');
    }

    const notification = await Notification.find({
      user: req.userId,
      read: false
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    //const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } // retorna o dado atualizado
    );

    return res.json(notification);
  }
}

export default new NotificationController();
