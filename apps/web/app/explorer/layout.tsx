export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pointer-events-none fixed right-0 top-24 z-50 hidden h-[180px] w-[180px] overflow-hidden md:block">
        <a
          href="https://github.com/txpipe/dolos"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto absolute right-[-48px] top-[38px] flex w-[200px] rotate-45 items-center justify-center bg-gradient-to-r from-purple-500 to-orange-500 py-2.5 text-center font-mono text-sm font-bold text-white shadow-md transition-opacity hover:opacity-80"
        >
          powered by Dolos
        </a>
      </div>
      {children}
    </>
  );
}
