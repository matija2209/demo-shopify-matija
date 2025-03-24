import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { useRef } from 'react';
import { FetcherWithComponents, Link } from '@remix-run/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { X } from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart, layout }: CartSummaryProps) {
  return (
    <Card noScale className={layout === 'page' ? 'h-fit sticky top-4' : 'border-0 shadow-none'}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Povzetek naročila</CardTitle>
      </CardHeader>

      <CardContent className="pb-4 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Skupna cena</span>
          <span className="font-medium">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        <CartDiscounts discountCodes={cart.discountCodes} />
        <CartGiftCard giftCardCodes={cart.appliedGiftCards} />
      </CardContent>

      <Separator />

      <CardFooter className="pt-4">
        <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
      </CardFooter>
    </Card>
  );
}

function CartCheckoutActions({ checkoutUrl }: { checkoutUrl?: string }) {
  if (!checkoutUrl) return null;

  return (
    <Link to={checkoutUrl} target="_self">
      <Button className="w-full" size="lg">
        Nadaljuj na plačilo
      </Button>
    </Link>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({ code }) => code) || [];

  return (
    <div className="space-y-3">
      {/* Have existing discount, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Popusti</span>
          <UpdateDiscountForm>
            <div className="flex items-center">
              <code className="bg-muted px-1 py-0.5 rounded text-xs">{codes?.join(', ')}</code>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </UpdateDiscountForm>
        </div>
      )}

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <Input
            type="text"
            name="discountCode"
            placeholder="Koda za popust"
            className="h-9 text-sm"
          />
          <Button type="submit" variant="outline" size="sm">
            Potrdi
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({ lastCharacters }) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  return (
    <div className="space-y-3">
      {/* Have existing gift card applied, display it with a remove option */}
      {codes.length > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Darilni boni</span>
          <UpdateGiftCardForm giftCardCodes={[]}>
            <div className="flex items-center">
              <code className="bg-muted px-1 py-0.5 rounded text-xs">{codes?.join(', ')}</code>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </UpdateGiftCardForm>
        </div>
      )}

      {/* Show an input to apply a gift card */}
      <Separator className="my-2" />
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex gap-2">
          <Input
            type="text"
            name="giftCardCode"
            placeholder="Koda darilnega bona"
            className="h-9 text-sm"
            ref={giftCardCodeInput}
          />
          <Button type="submit" variant="outline" size="sm">
            Potrdi
          </Button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}