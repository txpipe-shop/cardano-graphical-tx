export function getProviderTypeColor(type: string) {
  switch (type) {
    case 'utxorpc':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'blockfrost':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    default:
      return 'bg-blue-100 text-gray-800 dark:bg-blue-900 dark:text-blue-300';
  }
}

export function getNetworkColor(network: string) {
  switch (network) {
    case 'preprod':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'preview':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
  }
}
