import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        destructive:
          "bg-destructive text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/90 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        outline:
          "border-2 border-primary/80 bg-background shadow-md hover:shadow-lg hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        accent:
          "bg-accent text-accent-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
        ghost:
          "hover:bg-accent/20 hover:text-accent-foreground dark:hover:bg-accent/30 hover:shadow-sm transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 p-0 h-auto transition-colors",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4 rounded-lg",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3.5",
        lg: "h-12 rounded-xl px-7 has-[>svg]:px-5 text-base",
        xl: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        icon: "size-10 rounded-lg",
      },
      shape: {
        default: "",
        pill: "rounded-full",
        square: "rounded-none",
        squircle: "rounded-[30%]"
      },
      animation: {
        default: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        shimmer: "hover:animate-shimmer before:animate-shine"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      animation: "default"
    },
  }
)

function Button({
  className,
  variant,
  size,
  shape,
  animation,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape, animation, className }))}
      {...props}
    />
  )
}

// Add keyframe animations for the shimmer effect
const globalStyles = `
@keyframes shine {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}
`;

export { Button, buttonVariants }