function getRecipes() {

  var http = new XMLHttpRequest();                  //new XMLHttpRequest
  http.onload = function(){
    var response = http.responseText;
    console.log(response);
    populateMenu(response);                         //upon loading, send responseText to populateMenu()
  };

  http.open("GET","/recipes/",true);
  http.send();
}

function populateMenu(response) {
  response = response.split("<br/>")                                  //split response by <br/>
  for (element in response) {                                         //loop through elements of array

    var opt = document.createElement("option");                       //for each element, create and element
    opt.setAttribute("id", response[element]);                        //set it's id

    response[element] = response[element].replace(".json", "");
    opt.value = response[element];                                    //setting option's value
    response[element] = response[element].split("_");
    response[element] = response[element].join(" ");

    opt.innerHTML = response[element];                                //setting option's innerHTML
    // then append it to the select element
    document.getElementById("dropDown").appendChild(opt);             //append new option to dropdown menu
  }
}


function showCheck() {
  var check = document.getElementById("checkMark");
  check.style.visibility = "visible";                                 //Make checkmark visible
  setTimeout(hideCheck, 3000);                                        //Call hideCheck() after 3 secs
}

function hideCheck() {
  var check = document.getElementById("checkMark");
  check.style.visibility = "hidden";                                  //Hide checkmark
}


function viewInfo() {

  var xhr = new XMLHttpRequest();                                     //new XMLHttpRequest
  var jFile = dropDown.value + ".json";
  console.log(jFile);
  xhr.open("GET", "/recipes/" + jFile, true);                         //Send GET resquest for json file

  xhr.onload = function(){
    console.log(this.responseText);
    var response = this.responseText;
    var myObj = JSON.parse(response);                                 //Turning json string to js object
    document.getElementById("name").value = myObj.name;               //Set each textfield to specified
    document.getElementById("duration").value = myObj.duration;       //contents in json file
    document.getElementById("ingredients").value = (myObj.ingredients).join("\n");
    document.getElementById("steps").value = (myObj.directions).join("\n\n");
    document.getElementById("notes").value = myObj.notes;
  };
  xhr.send();
}

function postInfo() {
  var xhr = new XMLHttpRequest();                                      //new XMLHttpRequest
  var jFile = dropDown.value + ".json";
  xhr.open("POST", "/recipes/" + jFile);                                       //Send POST request for json file
  xhr.send(JSON.stringify({name: document.getElementById("name").value,        //Send JSON text to the server
                          duration: document.getElementById("duration").value,
                          ingredients: document.getElementById("ingredients").value.split("\n"),
                          directions: document.getElementById("steps").value.split("\n\n"),
                          notes: document.getElementById("notes").value}));
  showCheck();                                                                  //Call showCheck()
}
