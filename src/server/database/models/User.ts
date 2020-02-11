import {
  Sequelize,
  Model,
  DataTypes,
  Association,
} from 'sequelize';
import UserHash from './UserHash';
import Recipe from './Recipe';

class User extends Model {
  public id!: string;

  public name!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt: Date | null;

  public readonly hash?: UserHash;

  public readonly recipe?: Recipe;

  public static associations: {
    hash: Association<User, UserHash>;
    recipe: Association<User, Recipe>;
  };

  public static initialize(sequelize: Sequelize) {
    User.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        unique: 'uq_users_name',
        type: DataTypes.STRING(20),
      },
    }, {
      paranoid: true,
      sequelize,
      tableName: 'users',
    });

    return User;
  }

  public static associate() {
    User.hasOne(UserHash, {
      foreignKey: 'userId',
      as: 'hash',
    });
    User.hasOne(Recipe, {
      foreignKey: 'userId',
      as: 'recipe',
    });
  }
}

export default User;
