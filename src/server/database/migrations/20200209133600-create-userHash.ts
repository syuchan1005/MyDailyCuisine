/* eslint-disable no-console */
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('userHash', {
        userId: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        hash: {
          allowNull: false,
          type: Sequelize.CHAR(95),
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
      await queryInterface.addConstraint('userHash', ['userId'], {
        type: 'foreign key',
        name: 'fk_userHash_userId_id_users',
        references: {
          table: 'users',
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
  ) => queryInterface.dropTable('userHash'),
};
