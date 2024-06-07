export default {
  demo: [{ action: 'readonly', subject: 'demo' }],
  auth: [
    { action: 'publish', subject: 'auth' },
    { action: 'readonly', subject: 'auth' },
  ],
}
