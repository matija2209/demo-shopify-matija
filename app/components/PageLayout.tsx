import { Await, Link } from '@remix-run/react';
import { Suspense, useId } from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header, HeaderMenu } from '~/components/Header';
import { CartMain } from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';
import { ArrowRight, Loader2, Search, X } from 'lucide-react';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="p-4 flex flex-col gap-6">
        <SearchFormPredictive>
          {({ fetchResults, goToSearch, inputRef }) => (
            <div className="relative rounded-lg bg-gray-100 flex items-center overflow-hidden">
              <div className="absolute left-3 text-gray-500 pointer-events-none">
                <Search size={18} />
              </div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="w-full py-3 pl-10 pr-3 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-400"
              />
              <button
                onClick={goToSearch}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 transition-colors"
              >
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({ items, total, term, state, closeSearch }) => {
            const { articles, collections, pages, products, queries } = items;

            if (state === 'loading' && term.current) {
              return (
                <div className="flex justify-center items-center py-8 text-gray-500">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span>Searching...</span>
                </div>
              );
            }

            if (!total) {
              return (
                <div className="py-8 text-center text-gray-600">
                  <SearchResultsPredictive.Empty term={term} />
                </div>
              );
            }

            return (
              <div className="flex flex-col gap-6">
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />

                {products && products.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase text-gray-500 border-b border-gray-200 pb-2">Products</h3>
                    <div className="grid gap-4">
                      <SearchResultsPredictive.Products
                        products={products}
                        closeSearch={closeSearch}
                        term={term}
                      />
                    </div>
                  </div>
                )}

                {collections && collections.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase text-gray-500 border-b border-gray-200 pb-2">Collections</h3>
                    <div className="grid gap-2">
                      <SearchResultsPredictive.Collections
                        collections={collections}
                        closeSearch={closeSearch}
                        term={term}
                      />
                    </div>
                  </div>
                )}

                {pages && pages.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase text-gray-500 border-b border-gray-200 pb-2">Pages</h3>
                    <div className="grid gap-2">
                      <SearchResultsPredictive.Pages
                        pages={pages}
                        closeSearch={closeSearch}
                        term={term}
                      />
                    </div>
                  </div>
                )}

                {articles && articles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase text-gray-500 border-b border-gray-200 pb-2">Articles</h3>
                    <div className="grid gap-2">
                      <SearchResultsPredictive.Articles
                        articles={articles}
                        closeSearch={closeSearch}
                        term={term}
                      />
                    </div>
                  </div>
                )}

                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="group flex items-center justify-center py-3 mt-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    View all results for "<span className="italic">{term.current}</span>"
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : null}

                <button
                  onClick={closeSearch}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}
