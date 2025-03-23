import { Link, useNavigate } from '@remix-run/react';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductFragment } from 'storefrontapi.generated';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-full space-y-4 relative">
      {/* Price and Reviews Section - Combined in one row */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase mb-1 text-gray-500">Cena</h3>
          <div className="text-2xl font-bold text-purple-600">
            ${selectedVariant?.price?.amount || '19.75'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="text-xs font-bold uppercase mb-1 text-gray-500">Ocene</h3>
          <div className="flex items-center gap-2">
            <div className="flex text-purple-600">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">★</span>
              ))}
            </div>
            <span className="text-sm">4.7 <span className="text-gray-500">(232)</span></span>
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Product Options - More compact */}
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;
        console.log(option);
        return (
          <div key={option.name} className="bg-white rounded-lg p-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase mb-2 text-gray-500">
              {(() => {
                switch (option.name) {
                  case 'Size':
                    return 'Velikost';
                  case 'Color':
                    return 'Barva';
                  default:
                    return option.name;
                }
              })()}
            </h3>

            <div className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const optionButton = (
                  <div
                    className={`border rounded-md transition-all px-3 py-2 flex items-center justify-center
                      ${selected
                        ? 'border-purple-500 bg-purple-100 text-purple-700 font-bold'
                        : 'border-gray-300 hover:border-purple-400'
                      } 
                      ${available ? '' : 'opacity-40'}`}
                  >
                    {swatch ? (
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    ) : (
                      <span className={selected ? "font-bold" : ""}>{name}</span>
                    )}
                  </div>
                );

                if (isDifferentProduct) {
                  return (
                    <Link
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      className="block"
                    >
                      {optionButton}
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      key={option.name + name}
                      disabled={!exists}
                      className="block"
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      {optionButton}
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity */}
      <div className="bg-white rounded-lg p-3 shadow-sm">
        <h3 className="text-xs font-bold uppercase mb-2 text-gray-500">Količina</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border border-gray-300 rounded-md"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <MinusIcon size={16} />
          </Button>

          <div className="w-10 h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center font-medium">
            {quantity}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border border-gray-300 rounded-md"
            onClick={() => setQuantity(quantity + 1)}
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="mt-4">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: quantity,
                  selectedVariant,
                },
              ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Dodaj v košarico' : 'Ni na zalogi'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="h-6 w-6 rounded-full border border-gray-300 mr-1"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} className="w-full h-full object-cover rounded-full" />}
    </div>
  );
}