import * as React from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { ArrowDown } from 'lucide-react';

interface LoadMoreButtonProps {
    isLoading?: boolean;
    className?: string;
    onClick?: () => void;
}

/**
 * A centered Load More button with Slovenian translation
 * and animated styling based on the Button component
 */
export function LoadMoreButton({
    isLoading = false,
    className,
    onClick,
    ...props
}: LoadMoreButtonProps & React.ComponentProps<typeof Button>) {
    return (
        <div className="flex justify-center w-full my-8">
            <Button
                variant="accent"
                size="lg"
                animation="shimmer"
                className={cn(
                    "min-w-40 font-medium flex items-center justify-center gap-2",
                    className
                )}
                onClick={onClick}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Nalaganje...
                    </span>
                ) : (
                    <>
                        Naloži več
                        <ArrowDown className="size-5" />
                    </>
                )}
            </Button>
        </div>
    );
} 