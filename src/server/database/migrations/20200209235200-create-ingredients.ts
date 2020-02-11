/* eslint-disable no-console */
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('ingredients', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(100),
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
      await queryInterface.addConstraint('ingredients', ['name'], {
        type: 'unique',
        name: 'uq_ingredients_name',
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
  ) => queryInterface.dropTable('ingredients'),
};
