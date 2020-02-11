import { Sequelize } from 'sequelize';
import baseConfig from '../config';
import User from './User';
import UserHash from './UserHash';
import RecipeIngredient from './RecipeIngredient';
import Recipe from './Recipe';
import RecipeStep from './RecipeStep';
import Ingredient from './Ingredient';
import Token from './Token';


const env = process.env.NODE_ENV || 'development';
const config = baseConfig[env];

let s: Sequelize;
if (config.dialect === 'sqlite') {
  s = new Sequelize(config);
} else if (config.use_env_variable) {
  s = new Sequelize(process.env[config.use_env_variable], config);
} else {
  s = new Sequelize(config.database, config.username, config.password, config);
}

export const sequelize = s;

export const models = {
  User: User.initialize(sequelize),
  UserHash: UserHash.initialize(sequelize),
  RecipeIngredient: RecipeIngredient.initialize(sequelize),
  Recipe: Recipe.initialize(sequelize),
  RecipeStep: RecipeStep.initialize(sequelize),
  Ingredient: Ingredient.initialize(sequelize),
  Token: Token.initialize(sequelize),
};

// @ts-ignore
Object.values(models).forEach(({ associate }) => {
  if (associate) associate();
});

export default async () => {
  await Promise.all(Object.values(models).map((m) => m.sync()));
  return sequelize;
};
