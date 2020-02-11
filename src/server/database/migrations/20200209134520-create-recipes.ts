/* eslint-disable no-console */
import { DataTypes, QueryInterface } from 'sequelize';

module.exports = {
  up: (
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes,
  ) => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.createTable('recipes', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        image: {
          allowNull: false,
          defaultValue: false,
          type: Sequelize.BOOLEAN,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING(20),
        },
        nameHiragana: {
          allowNull: false,
          type: Sequelize.STRING(60),
        },
        description: {
          allowNull: false,
          type: Sequelize.STRING(60),
        },
        howMany: {
          allowNull: false,
          type: Sequelize.STRING(10),
        },
        trick: {
          allowNull: false,
          defaultValue: '',
          type: Sequelize.STRING(120),
        },
        background: {
          allowNull: false,
          defaultValue: '',
          type: Sequelize.STRING(120),
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
      await queryInterface.addConstraint('recipes', ['name', 'userId'], {
        type: 'unique',
        name: 'uq_recipes_name_userId',
        transaction,
      });
      await queryInterface.addConstraint('recipes', ['userId'], {
        type: 'foreign key',
        name: 'fk_recipes_userId_id_users',
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
  ) => queryInterface.dropTable('recipes'),
};
