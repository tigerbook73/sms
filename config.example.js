/**
 * global config
 */
const interval = 3; // interval to check, seconds
const failLimit = 6; // send SMS after this limit reached

/**
 * contact groups
 */
const group1 = [
  "4xxxxxxx", // david
  "48888888", // some else
];

const group2 = [
  "0499525618", // tim
];

/**
 * hostGroups
 */
const hostsGroup = [
  // test
  [
    { host: "127.0.0.1", name: "Local", to: group1 },
    { host: "192.168.1.104", name: "Test", to: group1 },
  ],

  // redtrain
  [
    { host: "127.0.0.1", name: "Local", to: group2 },
    { host: "192.168.1.104", name: "Test", to: group2 },
  ],

  // dv
  [],
];

module.exports = {
  hostsGroup: hostsGroup,
  interval: interval,
  failLimit: failLimit,
};
