import User from '../models/User';

class UserController {
  // async checkUserEmailExists(email) {
  //   const checkUserEmail = await User.findOne({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (checkUserEmail) {
  //     return true;
  //   }

  //   return false;
  // }

  async store(req, res) {
    const { email } = req.body;

    const checkUserEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkUserEmail) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }
}

export default new UserController();
