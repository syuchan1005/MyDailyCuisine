import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';
import { Context } from '@server/graphql';
import { sequelize } from '@server/database/models';
import createError from '@server/Errors';
import Recipe from '@server/database/models/Recipe';
import { asyncCancelMap, asyncMap, writeUpload } from '@server/Util';

import GQLMiddleware from '../GQLMiddleware';
import RecipeStep from '../../database/models/RecipeStep';
import Ingredient from '../../database/models/Ingredient';
import RecipeIngredient from '../../database/models/RecipeIngredient';
import User from '../../database/models/User';

class RecipeMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      recipes: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (user) {
          return Recipe.findAll({
            where: { userId: user.id },
          });
        }
        return Recipe.findAll();
      },
      recipe: async (parent, { id }) => Recipe.findOne({
        where: { id },
      }),
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      addRecipe: async (parent, { recipe: argRecipe }, context: Context) => {
        const user = await context.getUser();
        if (!user) return createError('QL0003');
        try {
          await sequelize.transaction(async (transaction) => {
            const recipe: Recipe = await Recipe.create({
              ...argRecipe,
              image: !!argRecipe.image,
              userId: user.id,
            }, { transaction });
            const steps: RecipeStep[] = await RecipeStep.bulkCreate(
              argRecipe.steps.map(({ step, description, image }) => ({
                step,
                description,
                image: !!image,
                recipeId: recipe.id,
              })),
              { transaction },
            );
            await asyncMap(argRecipe.ingredients, async ({ name, amount, groupName }) => {
              await Ingredient.create({ name }, { transaction }).catch(() => { /* ignored */ });
              const ingredient = await Ingredient.findOne({ where: { name }, transaction });
              await RecipeIngredient.create({
                recipeId: recipe.id,
                ingredientId: ingredient.id,
                amount,
                groupName,
              }, { transaction });
            });
            const removes = [];
            if (argRecipe.image) {
              const [remove, e] = await writeUpload(
                argRecipe.image,
                `storage/recipe/${recipe.id}.jpg`,
                { filterMineType: 'image/jpeg' },
              );
              if (!e.success) {
                await remove();
                throw e;
              }
              removes.push(remove);
            }
            const [ar, cancel] = await asyncCancelMap(steps,
              async ({ id, image }, i, arr, cancelled) => {
                if (!image) return { success: true };
                const [remove, e] = await writeUpload(
                  argRecipe.steps[i].image,
                  `storage/step/${id}.jpg`,
                  { filterMineType: 'image/jpeg' },
                );
                removes.push(remove);
                if (!e.success) cancelled();
                return e;
              });
            if (cancel) {
              await Promise.all(removes);
              throw ar[ar.length - 1];
            }
          });
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return createError('QL0007');
          }
          return createError('QL0004');
        }
        return {
          success: true,
        };
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Resolver(): { [p: string]: object } {
    return {
      Recipe: {
        user: (parent: Recipe) => User.findOne({ where: { id: parent.userId } }),
        steps: (parent: Recipe) => RecipeStep.findAll({ where: { recipeId: parent.id } }),
        ingredients: (parent: Recipe) => RecipeIngredient.findAll({
          where: { recipeId: parent.id },
          include: [{ model: Ingredient, as: 'ingredient' }],
        }).then((arr: RecipeIngredient[]) => arr.map((i) => ({
          ...i.dataValues,
          ingredient: i.ingredient?.dataValues,
        }))),
      },
    };
  }
}

export default RecipeMiddleware;
