_ = require("lodash");

const local = {
  redis: {
    domain: "localhost",
  },
  internal: {
    projectSendBack: {
      apiToken: "4232",
    },
  },
  "@include": "development",
};

const development = {
  redis: {
    domain: "redis.dev.env.sketchdeck.com",
  },
  paid: {
    key: "sk_123",
  },
  "@include": "all",
};

const all = {
  loggly: {
    token: "xyz",
    subdomain: "sketchdeck",
    level: "info",
  },
};

const configMap = new Map([
  ["local", local],
  ["development", development],
  ["all", all],
]);

// param env, a string describing the environment config to load
function getConfig(env) {
  return deepInclude(env);
}

function deepInclude(env) {
  current = configMap.get(env);

  if (current && current["@include"]) {
    return _.defaults(
      _.omit(current, "@include"),
      deepInclude(current["@include"])
    );
  }
  return _.omit(current, "@include");
}

/*

console.log(getConfig("local"));

Output:

{
  redis: { domain: "localhost" },
  internal: { projectSendBack: { apiToken: "4232" } },
  paid: { key: "sk_123" },
  loggly: { token: "xyz", subdomain: "sketchdeck", level: "info" },
}

*/
