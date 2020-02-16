/* eslint-disable no-console */
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('meals', {
        id: {
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          type: Sequelize.UUID,
        },
        time: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(120),
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING(120),
        },
        recipeId: {
          type: Sequelize.UUID,
        },
        userId: {
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
      await queryInterface.addConstraint('meals', ['recipeId'], {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: 'foreign key',
        name: 'fk_meals_recipeId_id_recipes',
        references: {
          table: 'recipes',
          field: 'id',
        },
        transaction,
      });
      await queryInterface.addConstraint('meals', ['userId'], {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: 'foreign key',
        name: 'fK_meals_userId_id_users',
        references: {
          table: 'users',
          field: 'id',
        },
        transaction,
      });
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
    return Promise.resolve();
  }),
  down: (queryInterface: QueryInterface) => queryInterface.dropTable('meals'),
};
