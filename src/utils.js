export const wsOrigin = window.location.origin.replace('http', 'ws');
export const socket = new WebSocket(wsOrigin, 'echo-protocol');
