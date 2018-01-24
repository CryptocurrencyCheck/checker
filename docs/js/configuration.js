function createCoinSelection(){
  var cs = document.getElementById("coin-selection");
  cs.textContent = "";
  var form = document.createElement("form");
  form.setAttribute("id","coin-selection-form");
  form.setAttribute("action","s");
  form.setAttribute("onsubmit","return false;");
  selected_coins = JSON.parse(window.localStorage.getItem("selected-coins"));
  if(selected_coins){
    updateSelectedCoins();
    var scl = selected_coins.length;
    for(var i=0; i<scl; i++){
      var checkbox = document.createElement("input");
      checkbox.setAttribute("type","checkbox");
      checkbox.setAttribute("name",selected_coins[i].id);
      form.appendChild(checkbox);
      form.innerHTML += "："+selected_coins[i].name+" ";
      form.appendChild(createUpButton(i));
      form.appendChild(createDownButton(i));
      form.appendChild(document.createElement("br"));
    }
  }else{
    selected_coins = new Array(0);
    for(var i=0; i<10; i++){
      var checkbox = document.createElement("input");
      checkbox.setAttribute("type","checkbox");
      checkbox.setAttribute("name",latest_data[i].id);
      form.appendChild(checkbox);
      form.innerHTML += "："+latest_data[i].name+" ";
      form.appendChild(createUpButton(i));
      form.appendChild(createDownButton(i));
      form.appendChild(document.createElement("br"));
      selected_coins.push(latest_data[i]);
    }
    window.localStorage.setItem("selected-coins", JSON.stringify(selected_coins));
  }

  cs.appendChild(form);
}

function updateCoinSelection(){
  var cs = document.getElementById("coin-selection");
  cs.textContent = "";
  var form = document.createElement("form");
  form.setAttribute("id","coin-selection-form");
  form.setAttribute("onsubmit","return false;");
  var scl = selected_coins.length;

  for(var i=0; i<scl; i++){
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("name",selected_coins[i].id);
    form.appendChild(checkbox);
    form.innerHTML += "："+selected_coins[i].name+" ";
    form.appendChild(createUpButton(i));
    form.appendChild(createDownButton(i));
    form.appendChild(document.createElement("br"));
  }

  window.localStorage.setItem("selected-coins", JSON.stringify(selected_coins));

  cs.appendChild(form);
}

function addCoinSelection(){
  var text = document.getElementById("search-coin");
  var coin = latest_data.filter(function(item, index){
    if ((item.id).indexOf(text.value) >= 0) return true;
  })[0];
  if(coin){
    var scl = selected_coins.length;
    var flag=true;
    for(var i=0; i<scl; i++){
      if(coin.id === selected_coins[i].id){
        flag=false;
      }
    }
    if(flag){
      selected_coins.push(coin);
      updateCoinSelection();
      createPriceData();
    }
  }
}

function removeCoinSelection(){
  var form = document.getElementById("coin-selection-form").elements;
  var fl = form.length;
  for(var i=0; i<fl; i++){
    if(form[i].checked){
      selected_coins.some(function(sc, j){
          if (sc.id===form[i].name) selected_coins.splice(j,1);
      });
    }
  }
  updateCoinSelection();
  createPriceData();
}

function updateSelectedCoins(){
  var scl = selected_coins.length;
  for(var i=0; i<scl; i++){
    selected_coins[i] = latest_data.filter(function(item, index){
      if ((item.id).indexOf(selected_coins[i].id) >= 0) return true;
    })[0];
  }
}

function createCandidate(){
  //HTML5のオートコンプリート 未対応が多かったのでjQueryUIのオートコンプリートに変更
  var ldl = latest_data.length;
  var str = "";
  for(var i=0; i<ldl; i++){
    str += '<option value="' + latest_data[i].id + '"></option>';
  }
  document.getElementById("coins-candidate").innerHTML = str;
}

function createCandidatejQueryUI(){
  var ldl = latest_data.length;
  var array = new Array(ldl);
  for(var i=0; i<ldl; i++){
    array[i] = latest_data[i].id;
  }

  $('#search-coin').autocomplete({
    source:array
  });
}

function settingDigit(){
  var e = document.getElementById("digit");
  if(window.localStorage.getItem("digit")){
    e.value = Number(window.localStorage.getItem("digit"));
  }else{
    window.localStorage.setItem("digit","0");
  }
}

function changeDigit(){
  var e = document.getElementById("digit");
  window.localStorage.setItem("digit",String(e.value));
  updateCoinSelection();
  createPriceData();
}

function createUpButton(num){
  var button = document.createElement("button");
  button.setAttribute("id","up-button-"+num);
  button.setAttribute("onclick","pushUpButton(this)");
  button.innerHTML = "↑";
  return button;
}

function createDownButton(num){
  var button = document.createElement("button");
  button.setAttribute("id","down-button-"+num);
  button.setAttribute("onclick","pushDownButton(this)");
  button.innerHTML = "↓";
  return button;
}

function pushUpButton(e){
  num = parseInt(e.id.split("-")[2]);
  if(selected_coins[num-1]){
    var tmp = selected_coins[num];
    selected_coins[num] = selected_coins[num-1];
    selected_coins[num-1] = tmp;
  }
  updateCoinSelection();
  createPriceData();
}

function pushDownButton(e){
  num = parseInt(e.id.split("-")[2]);
  if(selected_coins[num+1]){
    var tmp = selected_coins[num];
    selected_coins[num] = selected_coins[num+1];
    selected_coins[num+1] = tmp;
  }
  updateCoinSelection();
  createPriceData();
}
