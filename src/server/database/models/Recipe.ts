import {
  Sequelize,
  Model,
  DataTypes,
  Association,
} from 'sequelize';
import User from './User';
import RecipeStep from './RecipeStep';
import Ingredient from './Ingredient';
import RecipeIngredient from './RecipeIngredient';

class Recipe extends Model {
  public id!: string;

  public image!: boolean;

  public name!: string;

  public nameHiragana!: string;

  public description!: string;

  public howMany!: string;

  public trick!: string;

  public background!: string;

  public userId!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly user?: User;

  public readonly steps?: RecipeStep[];

  public readonly ingredients: Ingredient[];

  public static associations: {
    user: Association<Recipe, User>;
    steps: Association<Recipe, RecipeStep>;
    ingredients: Association<Recipe, Ingredient>;
  };

  public static initialize(sequelize: Sequelize) {
    Recipe.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      image: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      name: {
        allowNull: false,
        unique: 'uq_recipes_name_userId',
        type: DataTypes.STRING(20),
      },
      nameHiragana: {
        allowNull: false,
        type: DataTypes.STRING(60),
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(60),
      },
      howMany: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      trick: {
        allowNull: false,
        defaultValue: '',
        type: DataTypes.STRING(120),
      },
      background: {
        allowNull: false,
        defaultValue: '',
        type: DataTypes.STRING(120),
      },
      userId: {
        allowNull: false,
        unique: 'uq_recipes_name_userId',
        type: DataTypes.UUID,
      },
    }, {
      sequelize,
      tableName: 'recipes',
    });

    return Recipe;
  }

  public static associate() {
    Recipe.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
    Recipe.hasOne(RecipeStep, {
      foreignKey: 'recipeId',
      as: 'steps',
    });
    Recipe.belongsToMany(Ingredient, {
      foreignKey: 'recipeId',
      as: 'ingredients',
      through: RecipeIngredient,
    });
  }
}

export default Recipe;
