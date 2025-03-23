import { useLoaderData, Link } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowRight } from 'lucide-react';

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{ collections }] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return { collections };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const { collections } = useLoaderData<typeof loader>();
  console.log(collections);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-navy-900">Collections</h1>
      </div>

      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {({ node: collection, index }) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Card className="group overflow-hidden border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md">
      <Link
        prefetch="intent"
        to={`/collections/${collection.handle}`}
        className="block h-full"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {collection.image && (
            <Image
              alt={collection.image.altText || collection.title}
              aspectRatio="1/1"
              data={collection.image}
              loading={index < 8 ? 'eager' : 'lazy'}
              sizes="(min-width: 45em) 400px, 100vw"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-medium text-lg text-gray-900 mb-1 line-clamp-1">{collection.title}</h3>
          {collection.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{collection.description}</p>
          )}
        </CardContent>

        <CardFooter className="pt-0 pb-4 px-4">
          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 gap-2">
            View Collection <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    description
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
