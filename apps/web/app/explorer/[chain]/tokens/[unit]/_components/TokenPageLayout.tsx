import { Header } from "~/app/_components/Header";

interface TokenPageLayoutProps {
  children: React.ReactNode;
}

export function TokenPageLayout({ children }: TokenPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary-action focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-6"
      >
        <div className="flex min-h-0 flex-1">{children}</div>
      </main>
    </div>
  );
}
