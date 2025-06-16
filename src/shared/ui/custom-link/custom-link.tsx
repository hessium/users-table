import type { PropsWithChildren } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn.ts";

const customLinkVariants = cva(
  "inline-flex items-center justify-center rounded-md px-4 py-2 font-bold cursor-pointer tap-highlight-transparent text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white rounded hover:bg-white",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        ghost:
          "shadow-sm bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-500",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type CustomLinkProps = PropsWithChildren<{
  className?: string;
  to: string;
}> &
  VariantProps<typeof customLinkVariants>;

export const CustomLink = ({
  children,
  variant = "primary",
  className,

  to,
  ...props
}: CustomLinkProps) => {
  return (
    <a
      href={to}
      className={cn(customLinkVariants({ variant }), className)}
      {...props}
    >
      {children}
    </a>
  );
};
