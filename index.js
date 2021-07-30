const ping = require("ping");
const axios = require("axios");
const config = require("./config");

/**
 * check host
 * @param {*} hostsGroup
 */
function checkOlt(hostsGroup) {
  process.stdout.write(".");

  hostsGroup.forEach((hosts) => {
    hosts.forEach((host) => {
      host.failCount = host.failCount || 0;

      ping.promise
        .probe(host.host)
        .then((res) => {
          if (res.alive) {
            if (host.failCount >= config.failLimit) {
              sendSMS(host.to, host.name, "host is online.");
            }
            host.failCount = 0;

            // console.log((new Date()).toLocaleString().toUpperCase() + ":" + host.name + " is alive.");
          } else {
            throw res;
          }
        })
        .catch(() => {
          host.failCount++;

          console.log(new Date().toLocaleString().toUpperCase() + ":" + host.name + " ping failed");

          if (host.failCount == config.failLimit) {
            sendSMS(host.to, host.name, "host is offline");
          }
        });
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

function main() {
  setInterval(checkOlt, config.interval * 1000, config.hostsGroup);
}

main();
