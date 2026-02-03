export const ValidAddr = () => {
  return (
    <p className="text-xl text-p-secondary">
      Your address is a valid base58 address value. By decoding the base58
      content we obtain a bytestring that can be interpreted according to&nbsp;
      <a
        className="text-blue-400 underline hover:text-blue-400"
        href="https://cips.cardano.org/cip/CIP-0019"
        target="_blank"
        rel="noopener noreferrer"
      >
        CIP-0019
      </a>
      . The CIP explains that there are 3 types of possible address, each one
      following a different encoding format: Shelley, Stake, or Byron.
    </p>
  );
};
