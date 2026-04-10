export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="flex w-full items-center justify-center border-t border-border py-3 text-sm text-p-secondary">
        Powered by&nbsp;
        <a
          href="https://github.com/txpipe/dolos"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-p-primary hover:underline"
        >
          Dolos
        </a>
      </footer>
    </>
  );
}
