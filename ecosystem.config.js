module.exports = {
  apps: [
    {
      name: "app",
      script: "./www/app.js",
      env_production: {
        NODE_ENV: "production",
      },
      instances: 3,
      error_file: "./logs/err.log",
      max_memory_restart : "200M",
    },
  ],
};
