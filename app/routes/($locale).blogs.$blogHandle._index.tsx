import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, getPaginationVariables } from '@shopify/hydrogen';
import type { ArticleItemFragment } from 'storefrontapi.generated';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { Card, CardContent, CardFooter } from '~/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }];
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
  request,
  params,
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  const [{ blog }] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  return { blog };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}
export default function Blog() {
  const { blog } = useLoaderData<typeof loader>();
  const { articles } = blog;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-navy-900">{blog.title}</h1>
      </div>

      <div>
        <PaginatedResourceSection connection={articles} resourcesClassName='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {({ node: article, index }) => (
            <ArticleItem
              article={article}
              key={article.id}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));

  return (
    <Card className="">
      <Link
        to={`/blogs/${article.blog.handle}/${article.handle}`}
        className="block h-full"
      >
        {article.image && (
          <div className="relative aspect-[3/2] h-96 overflow-hidden bg-gray-100">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <CardContent className="p-4">
          <h3 className="font-medium text-lg text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{publishedAt}</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 px-4">
          <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 gap-2">
            Read Article <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Link>
    </Card >
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
