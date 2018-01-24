/* ========== 全てのフィールドはここで管理 ========== */
var latest_data = undefined;
var pre_data = undefined;
var selected_coins = undefined;

window.onload = function() {
  //window.localStorage.clear(); //ローカルストレージのクリア(検証用)
  var gt = getTicker({limit:"0",convert:"JPY"});
  gt.then((result) => {
    //createCandidate(); HTML5のオートコンプリート 未対応が多かったのでjQueryUIのオートコンプリートに変更
    createCandidatejQueryUI();
    settingDigit();
    createCoinSelection();
    $("#loading").hide();
    createPriceData();
  });
  regularUpdate();
};

/**
 * Get送信の簡単化
 * @param {String} url GETの送信先URL
 * @see https://developers.google.com/web/fundamentals/primers/promises?hl=ja
 */
function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      } else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    }

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    }

    // Make the request
    req.send();
  });
}

/* === memo ===
GetTickerに送るオプションの指定方法
!注意：全て{String}指定
var opt = {
  start: "0",
  limit: "10",
  convert: "JPY",
  currency: ""
}
GetTicker(opt);
*/

/**
 * 現在の仮想通貨のレートを取得
 * @param {Object} opt 取得する際のオプション
 * @see https://coinmarketcap.com/api/
 **/
function getTicker(opt) {
  var url = "https://api.coinmarketcap.com/v1/ticker/"
  if (opt) {
    if (opt.currency) {
      url += opt.currency + "/";
    }
    if (opt.start || opt.limit || opt.convert) {
      url += "?";
      if (opt.start) {
        url += "start=" + opt.start;
      }
      if (opt.convert) {
        if (url.endsWith("?")) {
          url += "convert=" + opt.convert;
        } else {
          url += "&convert=" + opt.convert;
        }
      }
      if (opt.limit) {
        if (url.endsWith("?")) {
          url += "limit=" + opt.limit;
        } else {
          url += "&limit=" + opt.limit;
        }
      }
    }
  }
  var promise = get(url).then(function(response) {
    pre_data = latest_data;
    latest_data = JSON.parse(response);
  }, function(error) {
    console.error("Failed!", error);
  });

  return promise;
}

function regularUpdate(){
  var date = new Date();
  window.localStorage.setItem("update-time",date);
  console.log("===== 読み込み時間 =====");
  console.log("初回:"+date);
  setInterval(function(){
    var gt = getTicker({limit:"0",convert:"JPY"});
    gt.then((result) => {
      createCoinSelection();
      createPriceData();
      console.log("更新:"+new Date());
    });
//  }, 30000); //30秒更新
  }, 300000); //5分更新
}

//バックグラウンドの操作
//document.addEventListener("pause", regularUpdate(), false);
