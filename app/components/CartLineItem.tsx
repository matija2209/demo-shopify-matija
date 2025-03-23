import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import { useVariantUrl } from '~/lib/variants';
import { Link } from '@remix-run/react';
import { ProductPrice } from './ProductPrice';
import { useAside } from './Aside';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Minus, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const { id, merchandise } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();

  return (
    <li key={id} className="py-4">
      <div className="flex gap-4">
        {image && (
          <div className="flex-shrink-0">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
            >
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={80}
                width={80}
                loading="lazy"
                className="rounded-md object-cover"
              />
            </Link>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="hover:underline"
          >
            <p className="font-medium text-sm md:text-base truncate">{product.title}</p>
          </Link>

          <div className="mt-1 text-sm text-muted-foreground">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>

          {selectedOptions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <Badge key={option.name} variant="outline" className="text-xs">
                  {option.name}: {option.value}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-3">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({ line }: { line: CartLine }) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const { id: lineId, quantity, isOptimistic } = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Količina: {quantity}</span>

      <div className="flex items-center">
        <CartLineUpdateButton lines={[{ id: lineId, quantity: prevQuantity }]}>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </CartLineUpdateButton>

        <CartLineUpdateButton lines={[{ id: lineId, quantity: nextQuantity }]}>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full ml-1"
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CartLineUpdateButton>

        <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
      </div>
    </div>
  );
}

/**
 * Gumb, ki odstrani artikel iz košarice. Onemogočen je,
 * ko je artikel nov in strežnik še ni potrdil njegove uspešne dodaje v košarico.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 ml-1 text-muted-foreground hover:text-destructive"
          disabled={disabled}
          aria-label="Odstrani artikel"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Odstranitev artikla</DialogTitle>
          <DialogDescription>
            Ali ste prepričani, da želite odstraniti ta artikel iz košarice?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Prekliči</Button>
          </DialogTrigger>
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesRemove}
            inputs={{ lineIds }}
          >
            <Button type="submit" variant="destructive">
              Odstrani
            </Button>
          </CartForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{ lines }}
    >
      {children}
    </CartForm>
  );
}