import * as React from "react"
import { cn } from "~/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-white text-card-foreground shadow-lg border-2 border-purple-500 transition-all hover:shadow-xl hover:scale-[1.02]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex flex-col space-y-1.5 p-6 after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-gradient-to-r after:from-teal-400 after:via-purple-500 after:to-orange-500",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "text-2xl font-bold tracking-tight text-black rotate-[-1deg] transform inline-block pb-1 border-b-4 border-orange-400",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-sm text-gray-700 font-medium leading-relaxed italic",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-block rounded-full bg-gradient-to-r from-pink-500 to-orange-500 p-[2px] shadow-lg hover:shadow-xl transition-all",
        className
      )}
    >
      <div className="bg-white rounded-full px-6 py-2 text-sm font-bold text-black hover:bg-transparent hover:text-white transition-colors" {...props} />
    </div>
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative p-6 pt-2 backdrop-blur-sm bg-white/80 z-10",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center p-6 pt-0 before:absolute before:left-6 before:right-6 before:h-px before:bg-gradient-to-r before:from-transparent before:via-gray-300 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}