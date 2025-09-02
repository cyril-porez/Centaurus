module.exports = {
  devServer: (cfg) => {
    cfg.client = cfg.client || {};
    cfg.client.overlay = false; // désactive l’overlay
    return cfg;
  },
};
