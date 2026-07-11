import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-[15px] font-bold uppercase tracking-wide transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        cta: "bg-cta text-white shadow-lg shadow-cta/25 hover:bg-cta-hover hover:shadow-xl hover:shadow-cta/30 focus-visible:outline-cta",
        secondary:
          "border border-border bg-surface text-foreground shadow-sm hover:bg-background hover:shadow focus-visible:outline-forest",
        "secondary-disabled":
          "cursor-not-allowed border border-border bg-surface text-muted-custom/50",
        compact:
          "shrink-0 bg-cta px-6 text-[13px] text-white shadow-md shadow-cta/20 hover:bg-cta-hover hover:shadow-lg hover:shadow-cta/25 focus-visible:outline-cta",
      },
      size: {
        default: "h-[56px] px-6",
        compact: "h-11",
        full: "h-[56px] w-full",
        "full-sm": "h-[56px] w-full max-w-sm",
      },
    },
    defaultVariants: {
      variant: "cta",
      size: "default",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    fullWidth?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
