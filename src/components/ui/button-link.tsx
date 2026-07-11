import { type AnchorHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonLinkVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-[15px] font-bold uppercase tracking-wide transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        cta: "bg-cta text-white shadow-lg shadow-cta/25 hover:bg-cta-hover hover:shadow-xl hover:shadow-cta/30 focus-visible:outline-cta",
        secondary:
          "border border-border bg-surface text-foreground shadow-sm hover:bg-background hover:shadow focus-visible:outline-forest",
      },
      size: {
        default: "h-[56px] px-6",
      },
    },
    defaultVariants: {
      variant: "cta",
      size: "default",
    },
  }
);

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonLinkVariants>;

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(buttonLinkVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
