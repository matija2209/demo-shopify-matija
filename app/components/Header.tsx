import { Suspense } from 'react';
import { Await, NavLink, useAsyncValue } from '@remix-run/react';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { twMerge } from 'tailwind-merge';
import { MenuIcon, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const { shop, menu } = header;
  return (
    <header className="">
      <div className='px-4 max-w-7xl mx-auto h-24 grid grid-cols-3 w-full items-center'>
        <div className='block md:hidden'>
          <HeaderMenuMobileToggle />
        </div>
        <div className='hidden md:block'></div>


        <NavLink className='text-center' prefetch="intent" to="/" style={activeLinkStyle} end>
          <strong className=' text-xl md:text-4xl font-semibold font-serif '>Vaš Kotiček Lepote</strong>
        </NavLink>

        <div className='flex justify-end'>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const { close } = useAside();

  // Desktop Navigation - Horizontal list
  if (viewport === 'desktop') {
    return (
      <nav className={twMerge("h-16 bg-gradient-to-r from-teal-400 via-purple-500 to-orange-500 text-white shadow-lg hidden md:block")} role="navigation">
        <div className='max-w-4xl mx-auto h-full w-full px-4'>
          <ul className='flex items-center justify-center h-full gap-8'>
            {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
              if (!item.url) return null;

              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                  item.url.includes(publicStoreDomain) ||
                  item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;

              return (
                <li key={item.id} className="list-none">
                  <NavLink
                    className="text-nowrap font-black uppercase hover:text-white hover:scale-105 hover:-translate-y-1 transform transition-all duration-300 py-1 relative group inline-block"
                    end
                    onClick={close}
                    prefetch="intent"
                    to={url}
                  >
                    <span className="group-hover:rotate-[-1deg] inline-block transition-transform duration-300">
                      {item.title}
                    </span>
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }

  // Mobile Navigation - Vertical list
  return (
    <nav className={twMerge("md:hidden")} role="navigation">
      <div className="p-4">
        {/* Mobile Header Bar */}


        {/* Mobile Navigation Links */}
        <ul className="flex flex-col gap-3 py-2">
          <li>
            <NavLink
              end
              onClick={close}
              className="font-black uppercase text-lg block py-3 px-4 bg-white bg-opacity-10 rounded-xl transform transition-all hover:bg-opacity-20 hover:scale-105"
              prefetch="intent"
              style={activeLinkStyle}
              to="/"
            >
              Home
            </NavLink>
          </li>

          {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
            if (!item.url) return null;

            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;

            return (
              <li key={item.id}>
                <NavLink
                  className="font-black uppercase text-lg block py-3 px-4 bg-white bg-opacity-10 rounded-xl transform transition-all hover:bg-opacity-20 hover:scale-105"
                  end
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle} className="hidden md:block">
        <Suspense fallback="Prijava">
          <Await resolve={isLoggedIn} errorElement="Prijava">
            {(isLoggedIn) => <Button variant={"link"}>{isLoggedIn ? 'Moj račun' : 'Prijava'}</Button>}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const { open } = useAside();
  return (
    <Button variant={"link"} className="block md:hidden" onClick={() => open('mobile')}>
      <MenuIcon />
    </Button>
  );
}

function SearchToggle() {
  const { open } = useAside();
  return (
    <Button variant={"link"} className="hidden md:block" onClick={() => open('search')}>
      Išči
    </Button>
  );
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <a href="/cart">
      <Button
        variant={"link"}

        className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          });
        }}
      >
        <ShoppingCart size={20} />
        <span className="hidden md:block font-medium">Košarica</span>
        {count !== null && count > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </span>
        )}

      </Button>
    </a>
  );
}
function CartToggle({ cart }: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
