import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
	Plan,
	PlanResponse,
	PlanSubSchema,
	ShoppingList,
	ShoppingListResponse,
	ShoppingListSubSchema,
	UserOptions,
	UserOptionsResponse,
	UserOptionsSubSchema,
} from './subDocuments';
import { ResponseModel } from './util/ResponseModel';
import { IRecipeBackend } from './recipe.model';
import { IIngredientBackend } from './ingredient.model';
import { NonFunctionPropertyNames } from './util/TypeSpecifier';

interface IUserShared {
	name?: string;
	email: string;
	password?: string;
	recipeCollection?: string[] | IRecipeBackend[];
	options?: UserOptions;
	plan?: Plan;
	oAuth?: string;
	availableIngredients?: string[] | IIngredientBackend[];
	shoppingList?: ShoppingList;
	// TODO: Figure out how to have the function declaration in the interface
	// comparePassword(candidatePassword: string): Promise<boolean>;
}

// Fields that exist only in the backend
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserBackend extends IUserShared {}

// Fields that exist only in the backend responses
interface IUserBackendResponse extends IUserBackend, ResponseModel {
	recipeCollection?: IRecipeBackend[] | string[];
	options?: UserOptionsResponse;
	plan?: PlanResponse;
	availableIngredients?: IIngredientBackend[] | string[];
	shoppingList?: ShoppingListResponse;
}

// Fields that exist only in the frontend.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IUserFrontend extends IUserShared {}

interface IUserDoc extends IUserBackend, Document {}

const UserSchemaFields: Record<keyof IUserBackend, unknown> = {
	name: { type: String, description: 'Name of the user' },
	email: {
		type: String,
		required: true,
		unique: true,
		description: 'Email of the user',
	},
	password: { type: String, description: 'Password of the user' },
	recipeCollection: {
		type: [Schema.Types.ObjectId],
		ref: 'recipes',
		description:
			'List of recipes now owned by the user (ObjectId referring to recipes)',
	},
	options: { type: UserOptionsSubSchema, description: 'User options' },
	plan: { type: PlanSubSchema, description: 'The MealPlan of the user' },
	oAuth: { type: String, description: 'OAuth of the user' },
	availableIngredients: {
		type: [Schema.Types.ObjectId],
		ref: 'ingredients',
		description: 'List of ingredients already available to the user at home',
	},
	shoppingList: {
		type: ShoppingListSubSchema,
		description: 'Shopping list of the user',
	},
};

const UserSchema = new Schema(UserSchemaFields, { timestamps: true });

// we need to get user's password into a hash before it is added to the database
// this is done in the model using the bcrypt
UserSchema.pre('save', async function (next) {
	const user = this as IUserDoc;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// Random additional data
	const salt = await bcrypt.genSalt(
		parseInt(process.env.SALT_WORKER_FACTOR as string, 10)
	);

	const hash = bcrypt.hashSync(user.password as string, salt);

	// Replace the password with the hash
	user.password = hash;

	return next();
});

/**
 * This function encrypts a password and validates
 * with the existing encrypted password from the user.
 *
 * @remarks
 * This function is added to the UserSchema.
 *
 * @param candidatePassword - a password to compare against the user's password
 * @returns a boolean value indicating whether the password is correct
 */
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	const user = this as IUserDoc;

	return bcrypt
		.compare(candidatePassword, user.password as string)
		.catch(() => false);
};

const User = model<IUserDoc>('users', UserSchema);

export { User, IUserDoc, IUserBackend, IUserBackendResponse, IUserFrontend };
