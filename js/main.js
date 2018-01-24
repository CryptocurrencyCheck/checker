function createPriceData() {
  var main = document.getElementById("main-body");
  main.textContent = "";
  var scl = selected_coins.length;
  var coins = new Array(0);
  for (var i = 0; i < scl; i++) {
    var coin = new Coin(selected_coins[i]);
    main.appendChild(coin.createCard());
    coins.push(coin);
  }
  main.appendChild(totalData(coins));
}

var Coin = function(sc) {
  //フィールド
  this.id = sc.id;
  this.name = sc.name;
  this.price_jpy = Number(sc.price_jpy);
  this.difference = undefined;
  this.value = undefined;
  this.have_price = undefined;
  this.have_difference = undefined;
  this.digit = Number(window.localStorage.getItem("digit"));

  //セッター
  this.setDifference = function(){
    if (pre_data) {
      var pdl = pre_data.length;
      var pre_price_jpy;
      for(var i=0; i<pdl; i++){
        if(pre_data[i].id === this.id){
          pre_price_jpy = pre_data[i].price_jpy;
          break;
        }
      }
      this.difference = this.price_jpy - pre_price_jpy;
    }
  }
  this.setValue = function(){
    var v = window.localStorage.getItem(this.id+"_value");
    if(v){
      this.value = Number(v);
    }else{
      this.value = 0;
    }
  }
  this.sethavePrice = function() {
    this.have_price = this.price_jpy * this.value;
  }
  this.sethaveDifference = function() {
    if(pre_data) {
      this.have_difference = this.difference * this.value;
    }
  }

  //ファンクション
  this.createCard = function() {
    this.setDifference();
    this.setValue();
    this.sethavePrice();
    this.sethaveDifference();
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.appendChild(this.createHeader());
    div.appendChild(this.createBlock());
    return div;
  }
  this.createHeader = function() {
    var h4 = document.createElement("h4");
    h4.setAttribute("class", "card-header");
    h4.textContent = sc.name;
    return h4;
  }
  this.createBlock = function() {
    var div = document.createElement("div");
    div.setAttribute("class", "card-body");
    div.appendChild(this.createTitle());
    div.appendChild(this.createText());
    div.appendChild(this.createPossession());
    return div;
  }
  this.createTitle = function() {
    var h4 = document.createElement("h4");
    h4.setAttribute("class", "card-title");
    h4.appendChild(this.priceJPY());
    h4.innerHTML += " ";
    h4.appendChild(this.priceDifference());
    return h4;
  }
  this.priceJPY = function() {
    var span = document.createElement("span");
    span.textContent = "¥" + this.price_jpy.toFixed(this.digit);
    return span;
  }
  this.priceDifference = function() {
    var span = document.createElement("span");
    span.setAttribute("id", this.id + "-difference");
    if (this.difference === 0) {
      span.setAttribute("style",'color:#0000FF;');
      span.textContent = "±0";
    } else if (this.difference > 0) {
      span.setAttribute("style",'color:#00FF00;');
      span.textContent = "+" + this.difference.toFixed(this.digit);
    } else if (this.difference < 0) {
      span.setAttribute("style",'color:#FF0000;');
      span.textContent = this.difference.toFixed(this.digit);
    } else {
      span.setAttribute("style",'color:#AAAAAA;');
      span.textContent = "±unknown";
    }
    return span;
  }
  this.createText = function() {
    var p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.appendChild(this.havePriceJPY());
    p.innerHTML += " ";
    p.appendChild(this.havePriceDifference());
    return p;
  }
  this.havePriceJPY = function(){
    var span = document.createElement("span");
    span.textContent = "have:¥" + this.have_price.toFixed(this.digit);
    return span;
  }
  this.havePriceDifference = function(){
    var span = document.createElement("span");
    if(this.have_difference === 0){
      span.setAttribute("style",'color:#0000FF;');
      span.textContent = "±0";
    }else if(this.have_difference > 0){
      span.setAttribute("style",'color:#00FF00;');
      span.textContent = "+" + this.have_difference.toFixed(this.digit);
    }else if(this.have_difference < 0){
      span.setAttribute("style",'color:#FF0000;');
      span.textContent = this.have_difference.toFixed(this.digit);
    }else{
      span.setAttribute("style",'color:#AAAAAA;');
      span.textContent = "±unknown";
    }
    return span;
  }
  this.createPossession = function(){
    var input = document.createElement("input");
    input.setAttribute("id",this.id+"_value");
    input.setAttribute("type","text");
    input.setAttribute("class","form-control");
    input.setAttribute("value",String(this.value));
    input.setAttribute("placeholder","Number of your coins");
    input.setAttribute("onchange","changeValue(this)");
    return input;
  }
}

function changeValue(e){
  if(/^[0-9]+\.[0-9]+$/.test(String(e.value)) || /^[0-9]+$/.test(String(e.value))){
    var scl = selected_coins.length;
    window.localStorage.setItem(e.id, e.value);
    createPriceData();
  }
  e.value = window.localStorage.getItem(e.id, e.value);
}

function totalData(coins){
  var card = document.createElement("div");
  card.setAttribute("class","card");
  var card_header = document.createElement("h4");
  card_header.setAttribute("class","card-header");
  card_header.textContent = "TOTAL"
  var card_body = document.createElement("div");
  card_body.setAttribute("class","card-body");
  var card_title = document.createElement("h4");

  var cl = coins.length;
  var have = 0;
  var have_difference = 0;
  for(var i=0; i<cl; i++){
    have += Number(coins[i].have_price);
    have_difference += Number(coins[i].have_difference);
  }

  card_title.setAttribute("class","card-title");
  var total_have = document.createElement("span");
  total_have.textContent = "¥"+have.toFixed(coins.digit);
  var total_have_difference = document.createElement("span");

  if(have_difference === 0){
    total_have_difference.textContent = "±0";
    total_have_difference.setAttribute("style",'color:#0000FF;');
  }else if(have_difference > 0){
    total_have_difference.textContent = "+" + have_difference.toFixed(coins.digit);
    total_have_difference.setAttribute("style",'color:#00FF00;');
  }else if(have_difference < 0){
    total_have_difference.textContent = have_difference.toFixed(coins.digit);
    total_have_difference.setAttribute("style",'color:#FF0000;');
  }else{
    total_have_difference.textContent = "±unknown";
    total_have_difference.setAttribute("style",'color:#AAAAAA;');
  }

  card_title.appendChild(total_have);
  card_title.innerHTML += " ";
  card_title.appendChild(total_have_difference);
  var card_text = document.createElement("div");
  card_text.setAttribute("class","card-text");
  card_text.textContent = window.localStorage.getItem("update-time");
  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card.appendChild(card_header);
  card.appendChild(card_body);
  return card;
}
