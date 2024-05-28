// https://github.com/newrelic/quickstarts-synthetics-library/blob/main/library/ICMP/script.js

const debugmode = false; // global variable for debug on-off switch
debug("ICMP Pinger Script starting...");

var assert = require('assert');
var ping = require('net-ping');

var session = ping.createSession({
  retries: 2,
  timeout: 1000
});

var checksCompleted = 0;

// Hosts are numbers in this example, but this could be replaced with a meaningful label for each host instead.
var checks = [
  { 'host': 'Google DNS', 'ip': '8.8.8.8' },
  { 'host': '2', 'ip': '255.255.255.254' },
  { 'host': '3', 'ip': '255.255.255.255' },
  { 'host': 'Google', 'ip': '172.217.175.110' },
  { 'host': 'Yahoo Japan', 'ip': '183.79.135.206' },
  { 'host': 'Facebook', 'ip': '31.13.82.36' },
  { 'host': 'twitter.com', 'ip': '104.244.42.193' },
  { 'host': 'amazon.co.jp', 'ip': '52.119.161.5' },
  { 'host': 'rakuten.co.jp', 'ip': '133.237.16.234' },
  { 'host': 'apple.com', 'ip': '17.253.144.10' },
 ]

// 今後の方針メモ:
// dns.resolve4()関数の利用による、FQDNからIPアドレスを解決してpingを実行するロジックを検討する

// Event API Initialization section
//Define your authentication credentials.
var myAccountID = $secure.MYACCOUNTID;
var myAPIKey = $secure.MYINGESTAPIKEY;

var options = {
  //Define endpoint URL.
  url: "https://insights-collector.newrelic.com/v1/accounts/"+myAccountID+"/events",
  //Define body of POST request.
  body: '',
  //Define New Relic API key and expected data type.
  headers: {
      'Api-Key': myAPIKey,
      'Content-Type': 'application/json'
      }
};

// ============== session handling section ==============
session.on("close", function () {
  debug("socket closed");
});

session.on("error", function (error) {
  debug(error.toString ());
  session.close ();
});
// ======================================================
function checkEndpoint(item) {
  debug('Ping for host ' + item.host + ' (IP ' + item.ip + ') is about starting...');
  session.pingHost(item.ip, function (error, target, sent, rcvd) {
    debug("error: " + error);
    debug("target: " + target);
    debug("sent: " + sent);
    debug("rcvd: " + rcvd);
    debug("==========================================");
    var timeRequired = rcvd - sent;
    var result = '';
    if (error) {
      //var timeRequired = rcvd - sent
      console.log('ERROR - Ping failed for host ' + item.host + ' (IP ' + item.ip + ') with error: ' + error);
      result = 'failed';

    }
    else {
      //var timeRequired = rcvd - sent
      console.log('Ping successful for host ' + item.host + ' (IP ' + item.ip + '). Response (ms): ' + timeRequired)
      result = 'success';

    }
    //Event APIを投げるためのBodyを生成する
    options.body = '[{"eventType":"CustomSyntheticICMPPolling", "Host Name":\"'+ item.host +'\", "Host IP":\"' + item.ip + '\", "Result":\"'+ result +'\","Reason":\"' + error + '\","ResponseTime":'+timeRequired+'}]';
    //ここでEvent APIを投げる
    console.log(options.body);
    $http.post(options, callback);

    checksCompleted++
    if (checksCompleted == checks.length) {
      session.close();
      console.log("All checks were successful.");
    }
    else {
      console.log("More checks to complete. Continuing...");
    }
  })
}

//Define expected results using callback function.
function callback(error, response, body) {
  //Log status code to Synthetics console.
  console.log(response.statusCode + " status code of Event API Response");
  //Verify that `body` contains element named `success` with a value of `true`.
  //console.log("BODY: " + body);
  //Log end of script.
  console.log("End reached");
}

function debug(message) {
  if (debugmode) {
    console.log("DEBUG: " + message);
  }
}

debug("Ping execution section is starting...");

// Check each endpoint
checks.forEach(checkEndpoint);

debug("Reached the bottom line of execution part.");
debug("==== details of ICMP ping execution coming after here...  ====");
