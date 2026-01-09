import { createPromiseClient, type PromiseClient, type Transport } from '@connectrpc/connect';
import { queryConnect, submitConnect, syncConnect, watchConnect } from '@utxorpc/spec';

export * from '@utxorpc/spec';

// Re-export Transport type for consumers
export type { Transport } from '@connectrpc/connect';

export interface UtxoRpcClientConfig {
  transport: Transport;
}

export class UtxoRpcClient {
  public query: PromiseClient<typeof queryConnect.QueryService>;
  public submit: PromiseClient<typeof submitConnect.SubmitService>;
  public sync: PromiseClient<typeof syncConnect.SyncService>;
  public watch: PromiseClient<typeof watchConnect.WatchService>;

  constructor({ transport }: UtxoRpcClientConfig) {
    this.query = createPromiseClient(queryConnect.QueryService, transport);
    this.submit = createPromiseClient(submitConnect.SubmitService, transport);
    this.sync = createPromiseClient(syncConnect.SyncService, transport);
    this.watch = createPromiseClient(watchConnect.WatchService, transport);
  }
}
