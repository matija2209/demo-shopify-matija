import React, { createContext, type ReactNode, useContext, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';


type AsideType = 'search' | 'cart' | 'mobile' | 'closed';

type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component using shadcn/ui Sheet
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const isOpen = type === activeType && activeType !== 'closed';

  // Determine side based on type
  const getSide = () => {
    switch (type) {
      case 'cart':
        return 'right';
      case 'mobile':
        return 'left';
      case 'search':
      default:
        return 'right';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side={getSide()} className="overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{heading}</SheetTitle>
          <SheetClose className="absolute top-4 right-4" />
        </SheetHeader>
        <div className="px-1">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}