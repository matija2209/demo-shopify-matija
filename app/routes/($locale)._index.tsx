import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense } from 'react';
import { Image, Money } from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'Trgovina Matija | Home' }];
};

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
async function loadCriticalData({ context }: LoaderFunctionArgs) {
  const [{ collections }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        <div className="flex-1 p-12 flex items-center">
          <div className="space-y-6 max-w-md">
            <p className="text-black text-sm font-medium">
              Revolucija urbane mode
            </p>
            <h1 className="text-5xl font-bold tracking-tight">
              ŽIVI GLASNO, OBLECI SE DRZNO
            </h1>
            <p className="text-black text-base">
              Od uličnih stilov do statement kosov - oblačila, ki govorijo tvoj jezik in izražajo tvojo edinstveno osebnost.
            </p>
            <div>
              <Button size={"lg"} >
                ODKRI ZDAJ
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 relative">
          {image && (
            <div className="h-full">
              <Image data={image} sizes="100vw" className="h-full w-full object-cover" />
              <div className="absolute top-1/3 right-12 bg-yellow-300 rounded-full px-6 py-3 text-center max-w-xs transform rotate-6">
                <p className="text-xs font-bold uppercase">Podpiramo mlade</p>
                <p className="text-xs font-bold uppercase">kreativne</p>
                <p className="text-xs font-bold uppercase">umetnike</p>
              </div>
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 bg-yellow-200 p-4 rotate-3">
                <div className="bg-pink-400 p-6 text-white">
                  <p className="text-xs font-light uppercase">Urbani stil</p>
                  <p className="text-2xl font-bold uppercase tracking-wider">STREET</p>
                  <p className="text-2xl font-bold uppercase tracking-wider">REVOLUTION</p>
                  <p className="text-xs uppercase tracking-wider mt-1">DRZEN • EDINSTVEN • COOL</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-orange-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-teal-400/20 blur-xl"></div>
      <div className="absolute -top-12 right-12 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 rotate-[-1deg] transform inline-block pb-1 border-b-4 border-orange-400">
          Trending Vibes
        </h2>
        <p className="text-gray-700 font-medium italic mb-8 max-w-2xl">
          Razkaži svojo edinstveno energijo z najnovejšimi kosi, ki definirajo tvoj stil
        </p>

        <Suspense fallback={
          <div className="text-center py-12 font-bold text-purple-500 text-lg animate-pulse">
            Nalagam...
          </div>
        }>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {response
                  ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="group transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                      to={`/products/${product.handle}`}
                    >
                      <div className="bg-white overflow-hidden rounded-xl border-2 border-purple-200 shadow-md mb-4">
                        <div className="relative aspect-square overflow-hidden">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500 z-10"></div>
                          <Image
                            data={product.images.nodes[0]}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            aspectRatio="1/1"
                            sizes="(min-width: 45em) 20vw, 50vw"
                          />
                          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/30 to-transparent"></div>
                        </div>
                      </div>
                      <div className="space-y-1 px-1">
                        <h4 className="font-bold text-lg text-black group-hover:text-purple-600 transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-black font-medium bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent inline-block">
                          <Money data={product.priceRange.minVariantPrice} />
                        </p>
                      </div>
                    </Link>
                  ))
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
