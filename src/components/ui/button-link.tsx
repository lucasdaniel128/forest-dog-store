import { type AnchorHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonLinkVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-[15px] font-bold uppercase tracking-wide transition-all duration-200 [transition-property:color,background-color,border-color,box-shadow,opacity] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      variant: {
        cta: "bg-cta text-white shadow-lg shadow-cta/25 hover:bg-cta-hover hover:shadow-xl hover:shadow-cta/30 focus-visible:outline-cta",
        secondary:
          "border border-border bg-surface-strong text-foreground shadow-sm hover:bg-surface hover:shadow focus-visible:outline-forest",
        "secondary-on-dark":
          "border border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15 focus-visible:outline-white",
      },
      size: {
        default: "h-[56px] px-6",
        "full": "h-[56px] w-full",
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
