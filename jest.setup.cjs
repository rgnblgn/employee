const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// LitElement için gerekli mock'lar
global.customElements = {
  define: jest.fn(),
  get: jest.fn(),
}; 