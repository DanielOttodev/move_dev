// Globals

console.log(DragSelect)
const db = firebase.firestore();
createjs.MotionGuidePlugin.install();
var stage = new createjs.Stage("demoCanvas");
createjs.Touch.enable(stage)
console.log(stage);
let primSelect;
//Unselect
var stageElem = document.getElementById("demoCanvas");
stageElem.addEventListener("click", e => {
  if (typeof selectedObjs !== undefined && e.altKey) {
    console.log("here");
    selectedObjs = [];
    let padlock = document.getElementById("padlock");
    document.getElementById("selectedName2").innerHTML = "";
    document.getElementById("selectedName2").appendChild(padlock);
    document.getElementById("selectedNodes").innerHTML = "";
    padlock.classList.add("fa-lock-open");
    padlock.classList.remove("fa-lock");
    $(".alert").show();
    window.setTimeout(function () {
      $(".alert").alert("close");
    }, 3000);
  }
});

//inits
let selectedObjs = [];
let selectActive = false;
let groupedNodes = null; // For group selection
let groupedOffset = []; // ^ Group selection offsets
let hasHandle = false;

//Helpers
// Color Gen
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  color = '#212121'
  return color;
}

function init() {}

// Add New Shape Button
const newBtn = document.getElementById("new");
newBtn.onclick = function () {
  var circle = new createjs.Shape();
  //VARIABLES
  //Drag Object Size
  dragRadius = 60;

  //Circle Create
  circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, 20);
  circle.x = 7;
  circle.y = 7;

  var dragger = new createjs.Container();
  dragger.name = `New${stage.children.length + 1}`;
  circle.name = dragger.name;
  // Label
  var label = new createjs.Text(circle.name, "Bold 18px ", "#fff");

  label.textAlign = "center";
  label.y -= 0;
  label.x = 5;
  dragger.x = randomWithinRange(5, 600);
  dragger.y = randomWithinRange(5, 450);
  dragger.addChild(circle, label);
  dragger.setBounds(100, 100, dragRadius, dragRadius);

  //DragRadius * 2 because 2*r = width of the bounding box

  //DRAG Functionality ============

  dragger.on("pressmove", function (evt) {
    let match = selectedObjs.map(a => a.id) // Returns an array of all selectedObj id's in the correct index order.
    // console.log(evt.currentTarget.id)

    
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    if (selectedObjs.length > 0) {
      selectedNodeIndex = selectedObjs.findIndex(x => x.id === evt.currentTarget.id)
      console.log(evt.stageY)
      selectedObjs[selectedNodeIndex].x = evt.stageX 
      selectedObjs[selectedNodeIndex].y = evt.stageY
      groupedOffset[selectedNodeIndex].x = evt.stageX - handler.x
      groupedOffset[selectedNodeIndex].y = evt.stageY - handler.y
    }
    stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
    evt.currentTarget.alpha = 1;
  });
  dragger.on("pointerdown", function (evt) {
    console.log('in function')
    console.log(evt);
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
    evt.currentTarget.alpha = 1;
  });
  stage.addChild(dragger);
  stage.update();

  // Event Listeners
  circle.addEventListener("click", handleClick);

  function handleClick(event) {

    if (event.nativeEvent.shiftKey || selectActive === true) {
      let result = selectedObjs.map(a => a.id);
      if (result.includes(event.currentTarget.parent.id)) {
        // Do nothing, already selected
      } else {
        selectedObjs.push(event.currentTarget.parent);
        if (groupedNodes == null) {
          var cross = new createjs.Shape();
          cross.graphics.ss(3).s("#00f").mt(-10, 0).lt(10, 0).mt(0, -10).lt(0, 10);
          // Add a hitArea to the cross-hair so it is easier to press
          cross.hitArea = new createjs.Shape(new createjs.Graphics().f("green").dc(0, 0, 30));
          //Circle Create
          //  circle.graphics.beginFill("#ff0000").drawRect(0, 0, 20, 20);
          console.log("Firing!")
          handler = new createjs.Container()
          handler.id = "handle"
          handler.addChild(cross)
          handler.x = event.currentTarget.parent.x - 50
          handler.y = event.currentTarget.parent.y + 50
          groupedNodes = new createjs.Container()
          //     groupedNodes.addChild(event.currentTarget.parent)
          groupedNodes.offset = new createjs.Point(event.currentTarget.parent.x - handler.x, event.currentTarget.parent.y - handler.y);
          groupedOffset.push(groupedNodes.offset)
          //groupedNodes.setBounds(0, 0, dragRadius, dragRadius);
          stage.addChild(handler);
          hasHandle = true;
          //     stage.addChild(groupedNodes);
          stage.update();
        } else {
          // groupedNodes.addChild(event.currentTarget.parent)
          groupedNodes.offset = new createjs.Point(event.currentTarget.parent.x - handler.x, event.currentTarget.parent.y - handler.y);
          groupedOffset.push(groupedNodes.offset)
          stage.update();
        }
        handler.on("pressmove", function (evt) {
          evt.currentTarget.x = evt.stageX;
          evt.currentTarget.y = evt.stageY;
          //  stage.update(); //much smoother because it refreshes the screen every pixel movement instead of the FPS set on the Ticker
          evt.currentTarget.alpha = 1;

          for (let z = 0; z < selectedObjs.length; z++) {
            selectedObjs[z].x = handler.x + groupedOffset[z].x;
            selectedObjs[z].y = handler.y + groupedOffset[z].y;
          }

          stage.update();
        });

        event.currentTarget.graphics._fill.style = "#2196f3"
        stage.update();
      }
    }
  }
  circle.addEventListener("mousedown", handlePress);

  function handlePress(event) {
    //  document.getElementById("selectedName").innerHTML =
    //    event.currentTarget.name;

    // Change Color in Card
    //  document.getElementById("selectedColor").value = event.currentTarget.graphics._fill.style;
    // document.getElementById("namechange").value = "";

    // A mouse press happened.
    // Listen for mouse move while the mouse is down:
    //  event.addEventListener("mousemove", handleMove);

  }

  //Update stage will render next frame
  createjs.Ticker.addEventListener("tick", handleTick);

  function handleTick() {}
};

//Stage Buttons
const workBtn = document.getElementById("react");
const saveBtn = document.getElementById("save");
const playBtn = document.getElementById("playBtn");
const scrapBtn = document.getElementById("scrapBtn");
const selectBtn = document.getElementById("selectBtn");
/*workBtn.onclick = function () {
  for (i = 0; i < stage.children.length; i++) {
    console.log(stage.children[i]);
    console.log(stage.children[i].name);
    var infoNode = document.createElement("p");
    var text = document.createTextNode(
      `Name: ${stage.children[i].name} x: ${stage.children[i].x} y: ${stage.children[i].y} id: ${stage.children[i].id} `
    );
    infoNode.appendChild(text);
    document.getElementById("infoSection").appendChild(infoNode);
  }
};*/

// Init the array of positions
let savedPositions = [];
let allScenes = [];
// Populate when save button clicked
saveBtn.onclick = function () {
  let notes = document.getElementById("formationNotes").value;
  let savedPositions = [];
  for (i = 0; i < stage.children.length; i++) {
    this.formation = {
      name: stage.children[i].name,
      x: stage.children[i].x,
      y: stage.children[i].y,
      id: stage.children[i].id
    };
    console.log(i);
    savedPositions.push(this.formation);

    console.log(savedPositions[i]);
  }

  savedPositions.notes = notes;
  savedPositions.id = allScenes.length
  //savedPositions.push(details)
  allScenes.push(savedPositions);
  console.log(allScenes);
  timeLine();
  document.getElementById("formationNotes").value = "";
};

playBtn.onclick = () => {
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  let allIds = getIds();
  for (c = 0; c < allIds.length; c++) {
    let id = allIds[c];
    let thisVal = findPositions(id);

    let myTween = getElement();
    console.log(myTween)

    function getElement() {
      for (i = 0; i < stage.children.length; i++) {
        if ((stage.children[c].id = id)) {
          let myTween = createjs.Tween.get(stage.children[c]);
          return myTween;
        }
      }
    }

    for (z = 0; z < thisVal.length; z++) {
      console.log(id);
      if (z <= 0) {
        myTween.to({
            x: thisVal[z].x,
            y: thisVal[z].y
          }

          // createjs.Ease.getPowInOut(4)
        );
      } else {
        goTween(myTween, thisVal[z]);
        console.log("in other positions");
      }

      function goTween(myTween, positions) {
        console.log(myTween)
        myTween.to({
            x: positions.x,
            y: positions.y
          },
          getSpeed() //,
          // createjs.Ease.getPowInOut(4)
        );
      }
    }
  }
};
const alignXBtn = document.getElementById("alignX");
const alignYBtn = document.getElementById("alignY");
const spaceYBtn = document.getElementById("spaceY");
const spaceXBtn = document.getElementById("spaceX");
const speedBtn = document.getElementById('speedBtn');
alignXBtn.addEventListener("click", alignX);
alignYBtn.addEventListener("click", alignY);
spaceYBtn.addEventListener("click", spaceY);
spaceXBtn.addEventListener("click", spaceX);
//Remove Positions from the current scene
scrapBtn.onclick = () => {
  console.log("here");
  for (let i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].children[0].graphics._fill.style = '#212121'
  }
  stage.update();
  selectedObjs = [];
  $(".alert").show();
  window.setTimeout(function () {
    $(".alert").alert("close");
  }, 3000);
};

// Create the Timeline of scenes
function timeLine() {
  let copyCanvas = document.createElement("canvas");
  let sourceCanvas = document.getElementById("demoCanvas");
  let canvasId = allScenes.length - 1 + "_scene";
  console.log(canvasId);
  copyCanvas.setAttribute("id", canvasId);
  copyCanvas.classList.add("savedScene");
  copyCanvas.height = 100
  copyCanvas.width = 150;
  copyCanvas.style = "display:inline";
  copyCanvas.classList.add("border");
  copyCanvas.classList.add("border-secondary");
  copyCanvas.classList.add("details");
  copyCtx = copyCanvas.getContext("2d");
  copyCtx.drawImage(
    document.getElementById("demoCanvas"),
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
    0,
    0,
    copyCanvas.width,
    copyCanvas.height
  );
  let canvasWrap = document.createElement("div");
  canvasWrap.classList.add("canvasCopys");
  canvasWrap.appendChild(copyCanvas);
  let sceneCount = document.getElementById("sceneInfo");
  let sceneTable = document.getElementById("scenes");
  let newTd = document.createElement("td");
  let sceneNum = document.createElement("span")

  sceneNum.classList.add("sceneTdInfo")
  sceneNum.innerHTML = sceneCount.childElementCount + 1;
  newTd.appendChild(sceneNum);
  let rubbishButton = document.createElement("i")
  rubbishButton.classList.add("fa-trash-alt");
  rubbishButton.classList.add("fas")
  rubbishButton.classList.add("rubbishBtn")
  rubbishButton.setAttribute("id", canvasId+'-RmBtn')
  let notesBtn = document.createElement("i")
  notesBtn.classList.add("fa-scroll");
  notesBtn.classList.add("fas")
  notesBtn.classList.add("notesBtn")
  newTd.appendChild(rubbishButton);
  newTd.appendChild(notesBtn);
  rubbishButton.onclick = (e) => { 
   // var houseIndex = street.houses.findIndex(h => h.rooms.some(r => r.id === roomId));
    let id = e.target.id.substr(0, e.target.id.indexOf('_'));  // Id of the scene to remove;
    let index = allScenes.findIndex(x => x.id == id)
    console.log(e.target.id)
    let rmCanvasId = e.target.id.substr(0, e.target.id.indexOf('-'));
    let rmCanvas = document.getElementById(rmCanvasId);
    if (index > -1) {
       allScenes.splice(index, 1);    
      rmCanvas.parentElement.parentElement.remove()
      let tdinfos = document.getElementsByClassName("sceneTdInfo")
      e.target.parentElement.remove()
      for(var x = 0; x < tdinfos.length; x ++){
        tdinfos[x].innerHTML = x+1;
      }
    }
    
  };
  newTd.classList.add("border");
  newTd.classList.add("rounded");
  sceneCount.appendChild(newTd);
  let newTd2 = document.createElement("td");
  newTd2.classList.add("border");
  newTd2.classList.add("rounded");
  newTd2.appendChild(canvasWrap);
  /*let notes = document.createElement("p");/// Notes
  notes.classList.add("text-dark");
  notes.textContent = document.getElementById("formationNotes").value;*/ 
  //newTd2.appendChild(notes);
  sceneTable.appendChild(newTd2);

  console.log("clicked it");
}


//Card Input
/*
const inputField = document.getElementById("namechange");
const colorField = document.getElementById("selectedColor");

inputField.onkeypress = e => {
  if (e.keyCode == 13) {
    let selectedObj = stage.getChildByName(
      document.getElementById("selectedName").innerHTML
    );
    console.log(selectedObj);
    selectedObj.name = inputField.value;
    selectedObj.children[0].name = inputField.value; //Update the name of the circle/shape to stop [selected] from retracing
    selectedObj.children[1].text = inputField.value; //Update the label to reflect on the actual shape
    document.getElementById("selectedName").innerHTML = inputField.value;
    //document.getElementById(selectedObj.id).innerHTML = inputField.value;

    stage.update(); // Update stage so takes place immediately instead of after moving the shape
  }
};

colorField.oninput = e => {
  let selectedObj = stage.getChildByName(
    document.getElementById("selectedName").innerHTML
  );

  selectedObj.children[0].graphics._fill.style = document.getElementById(
    "selectedColor"
  ).value;

  stage.update(); // Update stage so takes place immediately instead of after moving the shape
};
*/
selectBtn.onclick = () => {
  let selBtn = document.getElementById("selectBtn");
  if (selectActive === false) {
    selectActive = true;
    selBtn.classList.add("text-danger");
    document.getElementById("demoCanvas").style.cursor = "pointer";
  } else {
    console.log("here");

    for (let i = 0; i < selectedObjs.length; i++) {
      selectedObjs[i].children[0].graphics._fill.style = '#212121'
      stage.addChild(selectedObjs[i])

    }
    console.log(stage.children)
    if (hasHandle) {
      stage.removeChild(handler);
      hasHandle = false;
    }

    selectActive = false;
    selectedObjs = []
    groupedOffset = [];
    groupedNodes = null;
    stage.update();
    selBtn.classList.remove("text-danger");
    document.getElementById("demoCanvas").style.cursor = "auto";

  }
};

let toggleSpeedControl = false;
speedBtn.onclick = () => {
  if (toggleSpeedControl === false) {
    toggleSpeedControl = true;
    document.getElementById("formControlRange").style.display = "inline";
    document.getElementById("speedValue").style.display = "inline";
  } else {
    toggleSpeedControl = false;
    document.getElementById("formControlRange").style.display = "none";
    document.getElementById("speedValue").style.display = "none";

  }
};



function findPositions(id) {
  let elemPositions = [];
  for (i = 0; i < allScenes.length; i++) {
    elemPositions.push(allScenes[i].filter(x => x.id === id));
  }
  let newArrayPos = [];
  for (x = 0; x < elemPositions.length; x++) {
    newArrayPos.push(elemPositions[x][0]);
  }
  return newArrayPos;
}

function getIds() {
  let myArray = allScenes[0];

  let result = myArray.map(a => a.id);

  return result;
}

function getSpeed() {
  let sp = document.getElementById("formControlRange").value;
  sp = sp * 1000;

  return sp;
}

function alignY() {
  let y = selectedObjs[0].y;

  for (i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].y = y;
    groupedOffset[i].y = y - handler.y
    stage.update();
  }
}

function alignX() {
  let x = selectedObjs[0].x;

  for (i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].x = x;
    groupedOffset[i].x = x - handler.x
  
    stage.update();
  }
}

function spaceY() {
  let maxY = stage.canvas.clientHeight;
  let countNodes = selectedObjs.length;
  countNodes = countNodes + 1;
  let increment = maxY / countNodes;

  for (i = 0; i < selectedObjs.length; i++) {
    let pos = increment * i+1

    selectedObjs[i].y = pos;
    groupedOffset[i].y = pos - handler.y
    stage.update();
  }
}

function spaceX() { // 
  let maxX = stage.canvas.clientWidth;
  let countNodes = selectedObjs.length;
  countNodes = countNodes + 1;
  let increment = maxX / countNodes;

  for (i = 0; i < selectedObjs.length; i++) {
    let pos = increment * i+1
    selectedObjs[i].x = pos
    groupedOffset[i].x = pos - handler.x
    stage.update();
  }
}

function randomWithinRange(min, max) {
  return Math.random() * (max - min) + min;
}

document.body.onclick = (e) => {
  let id = e.target.id
  e = window.event ? event.srcElement : e.target;
  if (e.className && e.className.indexOf('savedScene') != -1) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
    let posIndex = id.substring(0, id.indexOf('_'))
    for (i = 0; i < allScenes[posIndex].length; i++) {
      console.log(i)
      console.log(allScenes[posIndex][i].x)
      let nodeId = allScenes[posIndex][i].id
      console.log("NodeID:" + nodeId)
      let myTween = getNode(nodeId)
      console.log(myTween)
      myTween.to({
          x: allScenes[posIndex][i].x,
          y: allScenes[posIndex][i].y
        }

      );
    }
  }
}

function getNode(matchId) {
  for (b = 0; b < stage.children.length; b++) {

    if (stage.children[b].id == matchId) {
      console.log(stage.children[b])
      let myTween = createjs.Tween.get(stage.children[b]);
      return myTween;
    }
  }
}

const saveAll = document.getElementById('saveAll')
saveAll.addEventListener('click', (e) => {
  e.preventDefault;
  let allSceneObj = Object.assign({}, allScenes); // {0:"a", 1:"b", 2:"c"}
  console.log(allSceneObj)
  db.collection('UserRoutines').add(allSceneObj);
})

function groupSelect() {
  let container = new createjs.Container();

}
/*
new DragSelect({
  selectables: document.getElementsByClassName('mStage'),
  //area: document.getElementsByClassName('mStage')
});*/