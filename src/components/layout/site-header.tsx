import logo from "@/assets/images/forest-dog-logo-horizontal.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center px-4 sm:h-[64px] sm:px-6 lg:px-8">
        <img
          src={logo}
          alt="Forest Dog"
          className="h-[38px] w-auto max-h-[44px] object-contain sm:h-[40px]"
        />
      </div>
    </header>
  );
}
