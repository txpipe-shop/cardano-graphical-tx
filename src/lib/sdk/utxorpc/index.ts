import { createPromiseClient, type PromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from './grpcTransport';
import { queryConnect, submitConnect, syncConnect, watchConnect } from '@utxorpc/spec';

export * from '@utxorpc/spec';

export interface UtxoRpcClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export class UtxoRpcClient {
  public query: PromiseClient<typeof queryConnect.QueryService>;
  public submit: PromiseClient<typeof submitConnect.SubmitService>;
  public sync: PromiseClient<typeof syncConnect.SyncService>;
  public watch: PromiseClient<typeof watchConnect.WatchService>;

  constructor(options: UtxoRpcClientConfig) {
    const transport = createGrpcTransport({
      httpVersion: '2',
      baseUrl: options.baseUrl,
      interceptors: options.headers
        ? [
            (next) => async (req) => {
              for (const [key, value] of Object.entries(options.headers!)) {
                req.header.set(key, value);
              }
              return next(req);
            }
          ]
        : []
    });

    this.query = createPromiseClient(queryConnect.QueryService, transport);
    this.submit = createPromiseClient(submitConnect.SubmitService, transport);
    this.sync = createPromiseClient(syncConnect.SyncService, transport);
    this.watch = createPromiseClient(watchConnect.WatchService, transport);
  }
}
