import { SEOProvider } from "./seo-provider";
import { MetaPixelProvider } from "./meta-pixel-provider";
import { AnalyticsProvider } from "./analytics-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SEOProvider>
      <AnalyticsProvider>
        <MetaPixelProvider>{children}</MetaPixelProvider>
      </AnalyticsProvider>
    </SEOProvider>
  );
}
