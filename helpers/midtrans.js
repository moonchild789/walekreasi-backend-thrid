const midtransClient = require("midtrans-client");

const snap = new midtransClient.Snap({
  isProduction: true, // ubah ke true untuk production
  serverKey: 'Mid-server--UVjDSp_A-fiTjcPfoDRO943'
});

module.exports = snap;
