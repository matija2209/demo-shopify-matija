import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.article.title ?? ''} article` }];
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
async function loadCriticalData({ context, params }: LoaderFunctionArgs) {
  const { blogHandle, articleHandle } = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', { status: 404 });
  }

  const [{ blog }] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: { blogHandle, articleHandle },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, { status: 404 });
  }

  const article = blog.articleByHandle;

  return { article };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}
export default function Article() {
  const { article } = useLoaderData<typeof loader>();
  const { title, image, contentHtml, author } = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 article">
      {/* Article Header with your existing structure */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          {title}
          <div className="text-lg font-normal text-gray-500 mt-2">
            {publishedDate} &middot; {author?.name}
          </div>
        </h1>
      </header>

      {/* Featured Image with your Image component */}
      {image && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-md">
          <Image
            data={image}
            sizes="90vw"
            loading="eager"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Article Content with your existing dangerouslySetInnerHTML */}
      <div
        dangerouslySetInnerHTML={{ __html: contentHtml }}
        className="article prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700"
      />
    </div>
  );
}


// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
