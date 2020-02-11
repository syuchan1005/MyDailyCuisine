import {
  Sequelize,
  Model,
  DataTypes,
  Association,
} from 'sequelize';
import Recipe from './Recipe';

class RecipeStep extends Model {
  public id!: string;

  public step!: number;

  public image!: boolean;

  public description!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly recipe?: Recipe;

  public static associations: {
    recipe: Association<RecipeStep, Recipe>;
  };

  public static initialize(sequelize: Sequelize) {
    RecipeStep.init({
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      step: {
        allowNull: false,
        unique: 'uq_recipeSteps_recipeId_step',
        type: DataTypes.INTEGER,
      },
      image: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(60),
      },
      recipeId: {
        allowNull: false,
        unique: 'uq_recipeSteps_recipeId_step',
        type: DataTypes.UUID,
      },
    }, {
      sequelize,
      tableName: 'recipeSteps',
    });

    return RecipeStep;
  }

  public static associate() {
    RecipeStep.belongsTo(Recipe, {
      foreignKey: 'recipeId',
      as: 'recipe',
    });
  }
}

export default RecipeStep;
