// For standalone SDK usage, import the specific transport you need:
// - Node.js: import { createGrpcTransport } from '@alexandria/utxorpc-sdk/transport/node'
// - Browser: import { createGrpcTransport } from '@alexandria/utxorpc-sdk/transport/web'
//
// This file re-exports the node transport as default for server-side usage.
// For browser/client bundling, configure your bundler to alias this import.

export { createGrpcTransport } from './grpcTransport.node';
