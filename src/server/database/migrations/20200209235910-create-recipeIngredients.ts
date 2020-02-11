/* eslint-disable no-console */
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('recipeIngredients', {
        id: {
          allowNull: false,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          type: DataTypes.UUID,
        },
        recipeId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        ingredientId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        groupName: {
          type: Sequelize.STRING(30),
        },
        amount: {
          allowNull: false,
          type: Sequelize.STRING(50),
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }, { transaction });
      await queryInterface.addConstraint('recipeIngredients', ['recipeId'], {
        type: 'foreign key',
        name: 'fk_recipeIngredients_recipeId_id_recipes',
        references: {
          table: 'recipes',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction,
      });
      await queryInterface.addConstraint('recipeIngredients', ['ingredientId'], {
        type: 'foreign key',
        name: 'fk_recipeIngredients_ingredientId_id_ingredients',
        references: {
          table: 'ingredients',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        transaction,
      });
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
    return Promise.resolve();
  }),
  down: (
    queryInterface: QueryInterface,
    // Sequelize: typeof DataTypes,
  ) => queryInterface.dropTable('recipeIngredients'),
};
