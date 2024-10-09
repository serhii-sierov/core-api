export enum ErrorMessage {
  WEBSOCKET_ERROR = 'Web socket error',
  UNEXPECTED_WEBSOCKET_ERROR = 'Unexpected websocket error',
  SUBSCRIPTION_ERROR = 'Subscription error',
}

export enum DebugMessages {
  CONNECTING_TO_WEBSOCKET = 'Connecting to websocket',
  CONNECTED_TO_WEBSOCKET = 'Connected to websocket',
  WEBSOCKET_CLOSED = 'Websocket closed',
  SUBSCRIBING = 'Subscribing to',
  SUBSCRIPTION_COMPLETE = 'Subscription complete',
}

export const GRAPHQL_SUBSCRIPTION_CONFIG_PROVIDER = 'GRAPHQL_SUBSCRIPTION_CONFIG';
