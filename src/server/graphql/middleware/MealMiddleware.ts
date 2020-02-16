import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { MutationResolvers, QueryResolvers } from '@common/GQLTypes';
import { Context } from '@server/graphql';
import Meal from '@server/database/models/Meal';
import createError from '@server/Errors';
import Recipe from '../../database/models/Recipe';

class MealMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Query(): QueryResolvers {
    return {
      meals: async (parent, args, context: Context) => {
        const user = await context.getUser();
        if (!user) return [];
        return Meal.findAll({ where: { userId: user.id } });
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      addMeal: async (parent, { meal }, context: Context) => {
        const user = await context.getUser();
        if (!user) return createError('QL0003');
        await Meal.create({
          ...meal,
          userId: user.id,
        });
        return { success: true };
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  Resolver(): { [p: string]: object } {
    return {
      Meal: {
        recipe: ({ recipeId }) => Recipe.findOne({ where: { id: recipeId } }),
      },
    };
  }
}

export default MealMiddleware;
