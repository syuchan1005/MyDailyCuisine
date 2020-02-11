import {
  Sequelize,
  Model,
  DataTypes, Association,
} from 'sequelize';
import Ingredient from './Ingredient';

class RecipeIngredient extends Model {
  public recipeId!: string;

  public ingredientId!: string;

  public groupName!: string;

  public amount!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly ingredient?: Ingredient;

  public readonly dataValues: RecipeIngredient;

  public static associations: {
    ingredient: Association<RecipeIngredient, Ingredient>;
  };

  public static initialize(sequelize: Sequelize) {
    RecipeIngredient.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      recipeId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      ingredientId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      groupName: {
        type: DataTypes.STRING(30),
      },
      amount: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
    }, {
      sequelize,
      tableName: 'recipeIngredients',
    });

    return RecipeIngredient;
  }

  public static associate() {
    RecipeIngredient.belongsTo(Ingredient, {
      foreignKey: 'ingredientId',
      as: 'ingredient',
    });
  }
}

export default RecipeIngredient;
