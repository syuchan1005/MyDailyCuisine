import { Op } from 'sequelize';

import GQLMiddleware from '@server/graphql/GQLMiddleware';
import { hash, verify, generateRandomToken } from '@server/Util';
import User from '@server/database/models/User';
import Token from '@server/database/models/Token';
import { sequelize } from '@server/database/models';
import Errors from '@server/Errors';

import { MutationResolvers } from '@common/GQLTypes';
import UserHash from '../../database/models/UserHash';

const expiresIn /* unit: sec */ = /* 10day */ 60 * 60 * 24 * 10;

class AuthMiddleware extends GQLMiddleware {
  // eslint-disable-next-line class-methods-use-this
  Mutation(): MutationResolvers {
    return {
      signUp: async (parent, { name, password }) => {
        let user: User;
        let token: Token;
        try {
          await sequelize.transaction(async (transaction) => {
            user = await User.create({
              name,
            }, { transaction });
            await UserHash.create({
              userId: user.id,
              hash: await hash(password),
            }, { transaction });
            token = await Token.create({
              userId: user.id,
              expires: Date.now() + expiresIn,
              accessToken: await generateRandomToken(),
              refreshToken: await generateRandomToken(),
            }, { transaction });
          });
        } catch (e) {
          return Errors('QL0000', { message: e });
        }
        if (token) {
          return {
            token: {
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
              expiresIn,
            },
            success: true,
          };
        }
        return Errors('QL0000');
      },
      logIn: async (parent, { name, password }) => {
        const user: User = await User.findOne({
          where: { name },
          include: [
            {
              model: UserHash,
              as: 'hash',
            },
          ],
        });
        if (!user?.hash?.hash || !(await verify(user?.hash?.hash, password))) {
          return Errors('QL0001');
        }
        let token: Token;
        try {
          await sequelize.transaction(async (transaction) => {
            token = await Token.create({
              userId: user.id,
              expires: Date.now() + expiresIn,
              accessToken: await generateRandomToken(),
              refreshToken: await generateRandomToken(),
            }, { transaction });
          });
        } catch (e) {
          return Errors('QL0000');
        }
        if (token) {
          return {
            token: {
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
              expiresIn,
            },
            success: true,
          };
        }
        return Errors('QL0000');
      },
      revokeToken: async (parent, { token }) => {
        let count: number = 0;
        await sequelize.transaction(async (transaction) => {
          count = await Token.destroy({
            where: {
              accessToken: token,
            },
            transaction,
          });
        });
        return count > 0;
      },
      refreshToken: async (parent, { refreshToken }) => {
        let token = await Token.findOne({
          where: {
            refreshToken,
            expires: { [Op.gte]: Date.now() },
          },
        });
        if (!token) {
          return Errors('QL0002');
        }
        try {
          await sequelize.transaction(async (transaction) => {
            await token.destroy({ transaction });
            token = await Token.create({
              userId: token.userId,
              expires: Date.now() + expiresIn,
              accessToken: await generateRandomToken(),
              refreshToken: await generateRandomToken(),
            }, { transaction });
          });
        } catch (e) {
          return Errors('QL0000');
        }
        return {
          token: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresIn,
          },
          success: true,
        };
      },
    };
  }
}

export default AuthMiddleware;
