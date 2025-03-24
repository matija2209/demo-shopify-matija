import { useOptimisticCart } from '@shopify/hydrogen';
import { Link } from '@remix-run/react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = Boolean(cart?.totalQuantity) && (cart?.totalQuantity ?? 0) > 0;

  return (
    <Card noScale className={`w-full ${layout === 'page' ? 'max-w-4xl mx-auto' : ''}`}>
      <CardContent className="p-0">
        <CartEmpty hidden={linesCount} layout={layout} />

        {Boolean(cartHasItems) && (
          <div className={`grid ${layout === 'page' ? 'grid-cols-1 md:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
            <ScrollArea className={`${layout === 'page' ? 'md:col-span-2' : ''} max-h-96`}>
              <ul className="divide-y px-6">
                {(cart?.lines?.nodes ?? []).map((line) => (
                  <CartLineItem key={line.id} line={line} layout={layout} />
                ))}
              </ul>
            </ScrollArea>

            {Boolean(cartHasItems) && (
              <div className={`${layout === 'page' ? 'md:col-span-1' : ''} px-6 pb-6`}>
                <CartSummary cart={cart} layout={layout} />
              </div>
            )}
          </div>
        )}
      </CardContent>

      {withDiscount && <Separator />}

      {Boolean(layout === 'page' && cartHasItems) && (
        <CardFooter className="flex justify-between pt-4">
          <Link to="/collections">
            <Button variant="outline" >
              Nadaljuj z nakupom
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

function CartEmpty({
  hidden = false,
  layout = 'page',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const { close } = useAside();

  if (hidden) return null;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <h3 className="text-xl font-medium mb-4">Tvoja košarica je prazna</h3>
      <p className="text-muted-foreground mb-6">
        Izgleda, da nisi dodal ničesar še, da bi se začel!
      </p>
      <Link to="/collections" onClick={close} prefetch="viewport">
        <Button>
          Nadaljuj z nakupom
        </Button>
      </Link>
    </div>
  );
}