type CreateGrpcTransport = typeof import('./grpcTransport.node').createGrpcTransport;

let createGrpcTransport: CreateGrpcTransport;

if (import.meta.env.SSR) {
  const nodeTransport = await import('./grpcTransport.node');
  createGrpcTransport = nodeTransport.createGrpcTransport;
} else {
  const webTransport = await import('./grpcTransport.web');
  createGrpcTransport = webTransport.createGrpcTransport;
}

export { createGrpcTransport };
