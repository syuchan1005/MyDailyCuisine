import {
  Sequelize,
  Model,
  DataTypes,
  Association,
} from 'sequelize';
import User from './User';

class UserHash extends Model {
  public userId!: string;

  public hash!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly user?: User;

  public static associations: {
    user: Association<UserHash, User>;
  };

  public static initialize(sequelize: Sequelize) {
    UserHash.init({
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      hash: {
        allowNull: false,
        type: DataTypes.CHAR(95),
      },
    }, {
      sequelize,
      tableName: 'userHash',
    });

    return UserHash;
  }

  public static associate() {
    UserHash.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default UserHash;
