//construct m * n rows
var m =20;
var n = 10.

var dataStore = [];

for(var i =0; i<m; i++) {
    dataStore.push({});
}

var table =document.querySelector('#data');

document.addEventListener("DOMContentLoaded", function(event) {
    drawTable();  
});

table.addEventListener('click', getInput);
table.addEventListener('contextmenu', confirmDialog);

function createNewRow(appendAt) {
    var tr =document.createElement('tr');
    for(var column =0; column < n; column++) {
        var td = document.createElement('td');
        tr.appendChild(td);
    }
    var button =document.createElement('button');
    button.appendChild(document.createTextNode('Add new row'));
    tr.appendChild(button);
    if (appendAt.id == 'data') {
        appendAt.appendChild(tr);
    }else {
        
        table.insertBefore(tr, appendAt.nextSibling);
    }
    
}

function drawTable() {
    for(var row =0; row < dataStore.length; row++) {
        createNewRow(table);
    } 
}


function getInput(event) {
    var target = event.target;
    if (target.tagName === 'TD') {
        var input = document.createElement('input');
        var blurEvent = document.createAttribute("onblur");
        blurEvent.value = "saveInput()";
        input.value = target.innerHTML;
        input.setAttributeNode(document.createAttribute("autofocus"));
        input.setAttributeNode(blurEvent);
        input.autofocus =true;
        target.parentNode.replaceChild(input, target);
    }
    else if (target.tagName === 'BUTTON') {
        createNewRow(target.parentNode);
    }
}

function saveInput() {
    var target = event.target;
    console.log(target.tagName)
    if (target.tagName === 'INPUT') {
        var parent = target.parentNode;
        var td = document.createElement('td');
        td.innerHTML = target.value;
        //td.setAttributeNode(document.createAttribute("autofocus"));
        console.log(parent);
        parent.replaceChild(td, target);
        
        console.log(td.cellIndex);
        addToStore(td.parentNode.rowIndex,td.cellIndex)
        
    }
}

function confirmDialog(event) {
    event.preventDefault();
    var target = event.target;
    if (target.tagName === 'TD') {
        if (confirm("Do you want to delete full row?")) {
            target.parentNode.parentNode.removeChild(target.parentNode);
        } else if(confirm("Do you want to delete this column")) {
            target.parentNode.removeChild(target);
        }
    }
}

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

var db;
var request = window.indexedDB.open("excelStore", 1);

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: "+ db);
 };

function addToStore(index) {
    console.log("rowIndex"+index);
    console.log("datastore"+dataStore[index]);
    var request = db.transaction(["excel"], "readwrite")
    .objectStore("excelSheet")
    .add(dataStore[index]);
    
    request.onerror = function(event) {
       alert("Unable to add data\r\nPrasad is already exist in your database! ");
    }
 }