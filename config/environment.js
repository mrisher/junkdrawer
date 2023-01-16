'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-todomvc',
    environment,
    rootURL: '/',
    locationType: 'history',
    FIREBASE_API_KEY: null,
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  ENV.FIREBASE_API_KEY = process.env.MY_FIREBASE_API_KEY;

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.FIREBASE_DATABASE_PARTITION = "dev/todos";
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.FIREBASE_DATABASE_PARTITION = "test/todos";
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.FIREBASE_DATABASE_PARTITION = "prod/todos";
  }

  return ENV;
};
