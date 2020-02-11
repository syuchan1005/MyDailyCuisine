import {
  Sequelize,
  Model,
  DataTypes,
  Association,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';

import User from './User';

class Token extends Model {
  public id!: number;

  public userId!: number;

  public expires!: Date;

  public accessToken!: string;

  public refreshToken!: string;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public createUser!: BelongsToCreateAssociationMixin<User>;

  public setUser!: BelongsToSetAssociationMixin<User, number>;

  public readonly user?: User;

  public static associations: {
    user: Association<Token, User>,
  };

  public static initialize(sequelize: Sequelize) {
    Token.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.CHAR(40),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.CHAR(40),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'tokens',
      timestamps: false,
    });

    return Token;
  }

  public static associate() {
    Token.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default Token;
