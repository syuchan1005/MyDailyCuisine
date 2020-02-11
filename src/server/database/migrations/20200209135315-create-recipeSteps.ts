/* eslint-disable no-console */
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('recipeSteps', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        step: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        image: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN,
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING(60),
        },
        recipeId: {
          allowNull: false,
          type: Sequelize.UUID,
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
      await queryInterface.addConstraint('recipeSteps', ['recipeId', 'step'], {
        type: 'unique',
        name: 'uq_recipeSteps_recipeId_step',
        transaction,
      });
      await queryInterface.addConstraint('recipeSteps', ['recipeId'], {
        type: 'foreign key',
        name: 'fk_recipeSteps_recipeId_id_recipes',
        references: {
          table: 'recipes',
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
  ) => queryInterface.dropTable('recipeSteps'),
};
