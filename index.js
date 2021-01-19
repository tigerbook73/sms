const ping = require("ping");
const axios = require("axios");

/**
 * configuration
 */
// host to check
const hosts = [
  //
  { host: "127.0.0.1", name: "Local Machine" },
];
const interval = 3; // interval to check, seconds
const failLimit = 6; // send SMS after this limit reached

// SMS receiver list
const smsList = [
  //
  // "04xxxxxxxx",
];

/**
 * check host
 * @param {*} hosts
 */
function checkOlt(hosts) {
  hosts.forEach((host) => {
    host.failCount = host.failCount || 0;

    ping.promise
      .probe(host.host)
      .then((res) => {
        if (res.alive) {
          if (host.failCount >= failLimit) {
            sendSMS(smsList, host.name, "host is online.");
          }
          host.failCount = 0;

          console.log(Date() + ":" + host.name + " is alive.");
        } else {
          throw res;
        }
      })
      .catch(() => {
        host.failCount++;

        console.log(Date() + ":" + host.name + " ping failed");

        if (host.failCount == failLimit) {
          sendSMS(smsList, host.name, "host is offline");
        }
      });
  });
}

/**
 * send SMS to receivers
 */
function sendSMS(receivers, host, message) {
  console.log("Sending SMS to : " + receivers.join(",") + " : " + message);
  axios
    .post("https://api.smsbroadcast.com.au/api-adv.php", {
      username: "aftel",
      password: "gkLnrmhj",
      to: receivers.join(","),
      from: "RedTrain",
      message: host + " : " + message,
      ref: host,
    })
    .then((response) => {
      console.log("Message sent successfully.");
    })
    .catch((error) => {
      console.log("Message sent failed.");
    });
}

setInterval(checkOlt, interval * 1000, hosts);
