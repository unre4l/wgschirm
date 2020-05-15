module.exports = {
  apps : [{
    name: 'wgschirm',
    script: './server.js',
    env: {
      NODE_ENV: 'production',
      WGSCHIRM_CONFIG: '/var/www/_config/wgschirm-server-neu',
    }
  }]
}
