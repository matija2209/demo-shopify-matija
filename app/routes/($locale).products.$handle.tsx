import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { ProductImageGallery } from '~/components/ProductImageGallery';
import { ProductForm } from '~/components/ProductForm';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { FeaturedTestimonials } from '~/components/FeaturedTestimonials';
import { Testimonials } from '~/components/Testimonials';
import { ProductFeatures } from '~/components/ProductFeatures';
import QuestionsAndAnswers, { QAPosts } from '~/components/QaSection';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Hydrogen | ${data?.product.title ?? ''}` },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
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
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context, params }: LoaderFunctionArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml, vendor, metafields, images } = product;

  // Check if product is on sale
  const isOnSale = selectedVariant?.compareAtPrice &&
    selectedVariant.compareAtPrice.amount > selectedVariant.price.amount;

  // Find the metafields using a type-safe approach
  type Metafield = { key: string; value: string };

  const getMetafield = (key: string): Metafield | undefined => {
    return metafields.find((field: any) => field?.key === key) as Metafield | undefined;
  };

  const faqMetafield = getMetafield('faq');
  const qaMetafield = getMetafield('q_a');
  const productFeaturesMetafield = getMetafield('product_features');
  const testimonialsMetafield = getMetafield('testimonials');

  return (
    <div className="py-12">
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500"></div>
      <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-purple-500/10 blur-xl"></div>
      <div className="absolute -bottom-8 right-8 w-40 h-40 rounded-full bg-teal-400/10 blur-xl"></div>

      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 relative z-10">
        {/* Product Image Column */}
        <div className="rounded-xl overflow-hidden bg-white border-2 border-purple-300 shadow-lg relative">
          <ProductImageGallery
            images={images.nodes as any}
            selectedVariantImage={selectedVariant?.image as any}
          />
          {isOnSale && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-1 px-3 rounded-full transform rotate-[-2deg] shadow-md">
              SALE
            </div>
          )}
        </div>

        {/* Product Info Column */}
        <Card className="border-2 border-purple-300 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Vendor Badge */}
            {vendor && (
              <Badge variant="outline" className="text-sm font-bold border-2 border-purple-500 px-3 py-1 rounded-full">
                {"Oblačila Vibes"}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight rotate-[-1deg] transform inline-block pb-1 border-b-4 border-orange-400">
              {title}
            </h1>

            {/* Product Form */}
            <div className="space-y-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

            {/* Product Description - Fixed Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full flex gap-4 p-2">
                <TabsTrigger className='flex-1' value="description">Opis</TabsTrigger>
                <TabsTrigger className='flex-1' value="details">Detajli</TabsTrigger>
                <TabsTrigger className='flex-1' value="shipping">Dostava</TabsTrigger>
              </TabsList>

              {/* With fixed height to prevent layout shifts */}
              <div className="min-h-[200px]">
                <TabsContent value="description" className="mt-6 prose prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="bg-purple-50 p-4">
                    <h3 className="font-bold mb-2">Detajli izdelka</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>100% urbani stil</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Trajnostni materiali</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Etično izdelano</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Primerno za vse velikosti</span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="shipping" className="mt-6">
                  <div className="bg-purple-50 p-4">
                    <h3 className="font-bold mb-2">Brezplačna dostava</h3>
                    <p className="text-slate-600 mb-2">Naročila nad 50€ so deležna brezplačne dostave.</p>
                    <p className="text-slate-600">Vsi izdelki so odpremljeni v 24 urah.</p>
                    <p className="text-slate-600 mt-2 italic">Hitra in trajnostna dostava - ker tvoj stil ne čaka!</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Product Features */}
      {productFeaturesMetafield && <ProductFeatures features={productFeaturesMetafield} />}

      {/* Featured Testimonials */}
      {testimonialsMetafield && <FeaturedTestimonials testimonials={testimonialsMetafield} />}

      {/* Add FAQ section */}
      {/* <ProductFAQ faqMetafield={faqMetafield} /> */}

      {/* All Testimonials */}
      {testimonialsMetafield && <Testimonials testimonials={testimonialsMetafield} />}
      {qaMetafield && <QuestionsAndAnswers questions={JSON.parse(qaMetafield.value) as QAPosts} />}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }

    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    featuredImage {
      url
      altText
      id
      width
      height
    }
    images (first: 10){
      nodes{
        altText
        id
        url
        width
        height
      }
    }
    description
    encodedVariantExistence
    encodedVariantAvailability
    metafields(identifiers: [{namespace: "custom", key: "faq"},{namespace: "custom", key: "q_a"},{namespace: "custom", key: "product_features"},{namespace: "custom", key: "testimonials"}]) {
      key
      value
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
