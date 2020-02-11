import {
  Sequelize,
  Model,
  DataTypes,
  Association,
} from 'sequelize';
import Recipe from './Recipe';
import RecipeIngredient from './RecipeIngredient';

class Ingredient extends Model {
  public id!: string;

  public name!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly recipes?: Recipe[];

  public readonly dataValues?: Ingredient;

  public static associations: {
    recipes: Association<Recipe, Ingredient>;
  };

  public static initialize(sequelize: Sequelize) {
    Ingredient.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      name: {
        allowNull: false,
        unique: 'name',
        type: DataTypes.STRING(100),
      },
    }, {
      sequelize,
      tableName: 'ingredients',
    });

    return Ingredient;
  }

  public static associate() {
    Ingredient.belongsToMany(Recipe, {
      foreignKey: 'ingredientId',
      as: 'recipes',
      through: RecipeIngredient,
    });
  }
}

export default Ingredient;
