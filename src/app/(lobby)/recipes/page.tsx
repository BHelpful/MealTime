import { serverClient } from '@/app/_trpc/serverClient';
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header';
import RecipeList from '@/components/recipes';
import { Shell } from '@/components/shells/shell';

const Page = async () => {
  const recipes = await serverClient.recipe.getPublicRecipes();

  return (
    <Shell className="gap-8">
      <PageHeader
        id="products-page-header"
        aria-labelledby="products-page-header-heading"
      >
        <PageHeaderHeading size="sm">Recipes</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          A collection of recipes for you to try.
        </PageHeaderDescription>
      </PageHeader>
      <RecipeList initialRecipes={recipes} />
    </Shell>
  );
};

export default Page;
