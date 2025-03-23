"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "~/lib/utils"
import useEmblaCarousel, {
    type UseEmblaCarouselType
} from "embla-carousel-react"

type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
    opts?: UseEmblaCarouselType[1]
    orientation?: "horizontal" | "vertical"
    initialSlide?: number
}

type CarouselContextProps = {
    carousel: ReturnType<typeof useEmblaCarousel>[0]
    api: ReturnType<typeof useEmblaCarousel>[1]
    scrollPrev: () => void
    scrollNext: () => void
    canScrollPrev: boolean
    canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
    const context = React.useContext(CarouselContext)

    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />")
    }

    return context
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    CarouselProps
>(({
    orientation = "horizontal",
    opts,
    className,
    children,
    initialSlide,
    ...props
}, ref) => {
    const [carouselRef, api] = useEmblaCarousel({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        startIndex: initialSlide,
    })
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
        api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault()
                scrollPrev()
            } else if (event.key === "ArrowRight") {
                event.preventDefault()
                scrollNext()
            }
        },
        [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
        if (!api) return

        const updateScrollState = () => {
            setCanScrollPrev(api.canScrollPrev())
            setCanScrollNext(api.canScrollNext())
        }

        api.on("reInit", updateScrollState)
        api.on("select", updateScrollState)

        updateScrollState()

        return () => {
            api.off("reInit", updateScrollState)
            api.off("select", updateScrollState)
        }
    }, [api])

    return (
        <CarouselContext.Provider
            value={{
                carousel: carouselRef,
                api: api,
                scrollPrev,
                scrollNext,
                canScrollPrev,
                canScrollNext,
            }}
        >
            <div
                ref={ref}
                onKeyDownCapture={handleKeyDown}
                className={cn(
                    "relative",
                    orientation === "horizontal" ? "w-full" : "h-full",
                    className
                )}
                role="region"
                aria-roledescription="carousel"
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({
    className,
    children,
    orientation = "horizontal",
    ...props
}, ref) => {
    const { carousel } = useCarousel()

    return (
        <div ref={carousel} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    "flex",
                    orientation === "horizontal"
                        ? "-ml-4 flex-row"
                        : "-mt-4 flex-col",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                "min-w-0 shrink-0 grow-0 basis-full pl-4",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel()

    return (
        <button
            ref={ref}
            className={cn(
                "absolute z-10 cursor-pointer",
                "disabled:opacity-50 disabled:pointer-events-none",
                className
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeftIcon className="h-8 w-8" />
            <span className="sr-only">Previous slide</span>
        </button>
    )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel()

    return (
        <button
            ref={ref}
            className={cn(
                "absolute z-10 cursor-pointer",
                "disabled:opacity-50 disabled:pointer-events-none",
                className
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRightIcon className="h-8 w-8" />
            <span className="sr-only">Next slide</span>
        </button>
    )
})
CarouselNext.displayName = "CarouselNext"

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} 