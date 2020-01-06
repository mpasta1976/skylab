import Sequelize, { Model } from 'sequelize';

import general from '../../config/general';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
            //return `${general.app_path}:${general.app_port}/files/${this.path}`;
          }
        }
      },
      {
        sequelize,
      }
    );

    return this;
  }

}

export default File;
