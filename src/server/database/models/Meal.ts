import {
  Association,
  DataTypes,
  Model,
  Sequelize,
} from 'sequelize';
import Recipe from './Recipe';
import User from './User';

class Meal extends Model {
  public id!: string;

  public time!: Date;

  public name!: string;

  public description!: string;

  public recipeId?: string;

  public userId!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly recipe?: Recipe;

  public readonly user?: User;

  public static associations: {
    recipe: Association<Meal, Recipe>;
    user: Association<Meal, User>;
  };

  public static initialize(sequelize: Sequelize) {
    Meal.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      time: {
        allowNull: false,
        defaultValue: DataTypes.NOW,
        type: DataTypes.DATE,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(120),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(120),
      },
      recipeId: {
        type: DataTypes.UUID,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
    }, {
      sequelize,
      tableName: 'meals',
    });

    return Meal;
  }

  public static associate() {
    Meal.belongsTo(Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe',
    });
    Meal.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

export default Meal;
