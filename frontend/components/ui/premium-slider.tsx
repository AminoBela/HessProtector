"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumSliderProps
    extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    variant?: "default" | "emerald" | "indigo" | "purple";
}

const variants = {
    default: "bg-zinc-900",
    emerald: "bg-emerald-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
};

const PremiumSlider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    PremiumSliderProps
>(({ className, variant = "default", ...props }, ref) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none items-center select-none group py-4", // Added padding for hover area
                className
            )}
            onPointerDown={() => setShowTooltip(true)}
            onPointerUp={() => setShowTooltip(false)}
            onPointerLeave={() => setShowTooltip(false)}
            {...props}
        >
            <div className="absolute top-1/2 left-0 right-0 h-2 -mt-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 overflow-hidden backdrop-blur-sm">
                <SliderPrimitive.Track className="relative h-full w-full grow overflow-hidden rounded-full">
                    <SliderPrimitive.Range
                        className={cn(
                            "absolute h-full transition-all duration-300 ease-out",
                            variant === "emerald" && "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
                            variant === "indigo" && "bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]",
                            variant === "purple" && "bg-gradient-to-r from-purple-400 to-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
                            variant === "default" && "bg-zinc-900 dark:bg-zinc-100"
                        )}
                    />
                </SliderPrimitive.Track>
            </div>

            <SliderPrimitive.Thumb
                className={cn(
                    "block h-7 w-7 rounded-full border-2 border-white dark:border-zinc-900 bg-white dark:bg-zinc-100 shadow-[0_4px_12px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-50 mt-[1px]", // Slight offset fix
                    "cursor-grab active:cursor-grabbing"
                )}
            >
                {/* Inner dot */}
                <div className={cn(
                    "absolute inset-0 m-auto h-2 w-2 rounded-full",
                    variant === "emerald" && "bg-emerald-500",
                    variant === "indigo" && "bg-indigo-500",
                    variant === "purple" && "bg-purple-500",
                    variant === "default" && "bg-zinc-900 dark:bg-zinc-400"
                )} />

                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -40, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            className={cn(
                                "absolute -left-1/2 -right-1/2 mx-auto w-max px-2 py-1 rounded-md text-xs font-bold text-white shadow-lg",
                                variant === "emerald" && "bg-emerald-500",
                                variant === "indigo" && "bg-indigo-500",
                                variant === "purple" && "bg-purple-500",
                                variant === "default" && "bg-zinc-900"
                            )}
                        >
                            {props.value?.[0]}
                        </motion.div>
                    )}
                </AnimatePresence>
            </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
    );
});
PremiumSlider.displayName = SliderPrimitive.Root.displayName;

export { PremiumSlider };
