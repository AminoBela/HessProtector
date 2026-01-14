import { Variants } from "framer-motion";

export const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const item: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { type: "tween", duration: 0.3, ease: "easeOut" } }
};
