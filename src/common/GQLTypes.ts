import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Upload: File | Promise<{ filename: string, mimetype: string, encoding: string, createReadStream: () => NodeJS.ReadableStream }>,
};

export type Ingredient = {
   __typename?: 'Ingredient',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type InputIngredient = {
  name: Scalars['String'],
  amount: Scalars['String'],
  groupName?: Maybe<Scalars['String']>,
};

export type InputRecipe = {
  image?: Maybe<Scalars['Upload']>,
  name: Scalars['String'],
  nameHiragana: Scalars['String'],
  description: Scalars['String'],
  howMany: Scalars['String'],
  trick: Scalars['String'],
  background: Scalars['String'],
  steps: Array<InputRecipeStep>,
  ingredients: Array<InputIngredient>,
};

export type InputRecipeStep = {
  step: Scalars['Int'],
  image?: Maybe<Scalars['Upload']>,
  description: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  /** # RecipeMiddleware */
  addRecipe: Result,
  /** # AuthMiddleware */
  signUp: TokenResult,
  logIn: TokenResult,
  refreshToken: TokenResult,
  revokeToken: Scalars['Boolean'],
};


export type MutationAddRecipeArgs = {
  recipe: InputRecipe
};


export type MutationSignUpArgs = {
  name: Scalars['String'],
  password: Scalars['String']
};


export type MutationLogInArgs = {
  name: Scalars['String'],
  password: Scalars['String']
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']
};


export type MutationRevokeTokenArgs = {
  token: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  /** # RecipeMiddleware */
  recipes: Array<Recipe>,
  recipe?: Maybe<Recipe>,
};


export type QueryRecipeArgs = {
  id: Scalars['ID']
};

export type Recipe = {
   __typename?: 'Recipe',
  id: Scalars['ID'],
  image: Scalars['Boolean'],
  name: Scalars['String'],
  nameHiragana: Scalars['String'],
  description: Scalars['String'],
  howMany: Scalars['String'],
  trick: Scalars['String'],
  background: Scalars['String'],
  user?: Maybe<User>,
  steps?: Maybe<Array<RecipeStep>>,
  ingredients?: Maybe<Array<RecipeIngredient>>,
};

export type RecipeIngredient = {
   __typename?: 'RecipeIngredient',
  id: Scalars['ID'],
  amount: Scalars['String'],
  groupName?: Maybe<Scalars['String']>,
  ingredient: Ingredient,
};

export type RecipeStep = {
   __typename?: 'RecipeStep',
  id: Scalars['ID'],
  step: Scalars['Int'],
  image: Scalars['Boolean'],
  description: Scalars['String'],
  recipe?: Maybe<Recipe>,
};

export type Result = {
   __typename?: 'Result',
  success: Scalars['Boolean'],
  code?: Maybe<Scalars['String']>,
  message?: Maybe<Scalars['String']>,
};

export type Token = {
   __typename?: 'Token',
  accessToken: Scalars['String'],
  refreshToken: Scalars['String'],
  expiresIn: Scalars['Int'],
};

export type TokenResult = {
   __typename?: 'TokenResult',
  success: Scalars['Boolean'],
  code?: Maybe<Scalars['String']>,
  message?: Maybe<Scalars['String']>,
  token?: Maybe<Token>,
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type RefreshTokenMutationVariables = {
  token: Scalars['String']
};


export type RefreshTokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshToken: (
    { __typename?: 'TokenResult' }
    & Pick<TokenResult, 'success' | 'code' | 'message'>
    & { token: Maybe<(
      { __typename?: 'Token' }
      & Pick<Token, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);

export type RecipeQueryVariables = {
  id: Scalars['ID']
};


export type RecipeQuery = (
  { __typename?: 'Query' }
  & { recipe: Maybe<(
    { __typename?: 'Recipe' }
    & Pick<Recipe, 'id' | 'image' | 'name' | 'nameHiragana' | 'description' | 'howMany' | 'background' | 'trick'>
    & { user: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    )>, ingredients: Maybe<Array<(
      { __typename?: 'RecipeIngredient' }
      & Pick<RecipeIngredient, 'id' | 'groupName' | 'amount'>
      & { ingredient: (
        { __typename?: 'Ingredient' }
        & Pick<Ingredient, 'id' | 'name'>
      ) }
    )>>, steps: Maybe<Array<(
      { __typename?: 'RecipeStep' }
      & Pick<RecipeStep, 'id' | 'step' | 'image' | 'description'>
    )>> }
  )> }
);

export type RecipesQueryVariables = {};


export type RecipesQuery = (
  { __typename?: 'Query' }
  & { recipes: Array<(
    { __typename?: 'Recipe' }
    & Pick<Recipe, 'id' | 'image' | 'name' | 'nameHiragana' | 'description'>
  )> }
);

export type AddRecipeMutationVariables = {
  recipe: InputRecipe
};


export type AddRecipeMutation = (
  { __typename?: 'Mutation' }
  & { addRecipe: (
    { __typename?: 'Result' }
    & Pick<Result, 'success' | 'code' | 'message'>
  ) }
);

export type SignInMutationVariables = {
  name: Scalars['String'],
  password: Scalars['String']
};


export type SignInMutation = (
  { __typename?: 'Mutation' }
  & { signIn: (
    { __typename?: 'TokenResult' }
    & Pick<TokenResult, 'success' | 'code' | 'message'>
    & { token: Maybe<(
      { __typename?: 'Token' }
      & Pick<Token, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);

export type SignUpMutationVariables = {
  name: Scalars['String'],
  password: Scalars['String']
};


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & { signUp: (
    { __typename?: 'TokenResult' }
    & Pick<TokenResult, 'success' | 'code' | 'message'>
    & { token: Maybe<(
      { __typename?: 'Token' }
      & Pick<Token, 'accessToken' | 'refreshToken' | 'expiresIn'>
    )> }
  ) }
);



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type isTypeOfResolverFn = (obj: any, info: GraphQLResolveInfo) => boolean;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Recipe: ResolverTypeWrapper<Recipe>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  User: ResolverTypeWrapper<User>,
  RecipeStep: ResolverTypeWrapper<RecipeStep>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  RecipeIngredient: ResolverTypeWrapper<RecipeIngredient>,
  Ingredient: ResolverTypeWrapper<Ingredient>,
  Mutation: ResolverTypeWrapper<{}>,
  InputRecipe: InputRecipe,
  Upload: ResolverTypeWrapper<Scalars['Upload']>,
  InputRecipeStep: InputRecipeStep,
  InputIngredient: InputIngredient,
  Result: ResolverTypeWrapper<Result>,
  TokenResult: ResolverTypeWrapper<TokenResult>,
  Token: ResolverTypeWrapper<Token>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  Recipe: Recipe,
  ID: Scalars['ID'],
  Boolean: Scalars['Boolean'],
  String: Scalars['String'],
  User: User,
  RecipeStep: RecipeStep,
  Int: Scalars['Int'],
  RecipeIngredient: RecipeIngredient,
  Ingredient: Ingredient,
  Mutation: {},
  InputRecipe: InputRecipe,
  Upload: Scalars['Upload'],
  InputRecipeStep: InputRecipeStep,
  InputIngredient: InputIngredient,
  Result: Result,
  TokenResult: TokenResult,
  Token: Token,
};

export type IngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addRecipe?: Resolver<ResolversTypes['Result'], ParentType, ContextType, RequireFields<MutationAddRecipeArgs, 'recipe'>>,
  signUp?: Resolver<ResolversTypes['TokenResult'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'name' | 'password'>>,
  logIn?: Resolver<ResolversTypes['TokenResult'], ParentType, ContextType, RequireFields<MutationLogInArgs, 'name' | 'password'>>,
  refreshToken?: Resolver<ResolversTypes['TokenResult'], ParentType, ContextType, RequireFields<MutationRefreshTokenArgs, 'refreshToken'>>,
  revokeToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRevokeTokenArgs, 'token'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  recipes?: Resolver<Array<ResolversTypes['Recipe']>, ParentType, ContextType>,
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType, RequireFields<QueryRecipeArgs, 'id'>>,
};

export type RecipeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Recipe'] = ResolversParentTypes['Recipe']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  image?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  nameHiragana?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  howMany?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  trick?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  background?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
  steps?: Resolver<Maybe<Array<ResolversTypes['RecipeStep']>>, ParentType, ContextType>,
  ingredients?: Resolver<Maybe<Array<ResolversTypes['RecipeIngredient']>>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type RecipeIngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeIngredient'] = ResolversParentTypes['RecipeIngredient']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  groupName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  ingredient?: Resolver<ResolversTypes['Ingredient'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type RecipeStepResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecipeStep'] = ResolversParentTypes['RecipeStep']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  step?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  image?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  recipe?: Resolver<Maybe<ResolversTypes['Recipe']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  expiresIn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type TokenResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TokenResult'] = ResolversParentTypes['TokenResult']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn,
};

export type Resolvers<ContextType = any> = {
  Ingredient?: IngredientResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Recipe?: RecipeResolvers<ContextType>,
  RecipeIngredient?: RecipeIngredientResolvers<ContextType>,
  RecipeStep?: RecipeStepResolvers<ContextType>,
  Result?: ResultResolvers<ContextType>,
  Token?: TokenResolvers<ContextType>,
  TokenResult?: TokenResultResolvers<ContextType>,
  Upload?: GraphQLScalarType,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
