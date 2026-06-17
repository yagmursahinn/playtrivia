import { notFound } from "next/navigation";
import { CategoryLandingPage } from "@/components/seo/CategoryLandingPage";
import {
  CATEGORY_LANDING_SLUGS,
  getCategoryLandingConfig,
  isCategoryLandingSlug,
  type CategoryLandingSlug,
} from "@/lib/seo/categories";
import { buildCategoryMetadata } from "@/lib/seo/metadata";

type CategoryLandingRouteProps = {
  params: Promise<{ categorySlug: string }>;
};

export async function generateStaticParams() {
  return CATEGORY_LANDING_SLUGS.map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: CategoryLandingRouteProps) {
  const { categorySlug } = await params;
  if (!isCategoryLandingSlug(categorySlug)) {
    return {};
  }
  return buildCategoryMetadata(categorySlug);
}

export default async function CategoryLandingRoute({ params }: CategoryLandingRouteProps) {
  const { categorySlug } = await params;
  if (!getCategoryLandingConfig(categorySlug)) {
    notFound();
  }

  return <CategoryLandingPage slug={categorySlug as CategoryLandingSlug} />;
}
