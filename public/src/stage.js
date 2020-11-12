// Globals
createjs.MotionGuidePlugin.install();
var stage = new createjs.Stage("demoCanvas");
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
    window.setTimeout(function() {
      $(".alert").alert("close");
    }, 3000);
  }
});
//inits
let selectedObjs = [];
let selectActive = false;
//Helpers
// Color Gen
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function init() {}

// Add New Shape Button
const newBtn = document.getElementById("new");
newBtn.onclick = function() {
  var circle = new createjs.Shape();
  //VARIABLES
  //Drag Object Size
  dragRadius = 40;

  //Circle Create
  circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, 20);
  circle.x = 7;
  circle.y = 7;

  var dragger = new createjs.Container();
  dragger.name = `New${stage.children.length + 1}`;
  circle.name = dragger.name;
  // Label
  var label = new createjs.Text(circle.name, "Bold 14px ", "#fff");

  label.textAlign = "center";
  label.y -= 0;
  label.x = 5;
  dragger.x = dragger.y = 100;
  dragger.addChild(circle, label);
  dragger.setBounds(100, 100, dragRadius, dragRadius);
  //DragRadius * 2 because 2*r = width of the bounding box

  //DRAG Functionality ============

  dragger.on("pressmove", function(evt) {
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
    // Action on selected

    if (event.nativeEvent.shiftKey || selectActive === true) {
      console.log(selectActive);
      selectedObjs.push(event.currentTarget.parent);

      let padlock = document.getElementById("padlock");
      document.getElementById("selectedName2").innerHTML = selectedObjs[0].name;
      document.getElementById("selectedName2").appendChild(padlock);
      addList = function(name, color) {
        if (name != selectedObjs[0].name) {
          let list = document.getElementById("selectedNodes");
          let newLi = document.createElement("li");
          newLi.classList.add("list-group-item");
          newLi.classList.add("bg-light");
          newLi.classList.add("border-info");
          newLi.style.color = color;

          newLi.innerHTML = name;
          list.appendChild(newLi);
        }
      };
      console.log(selectedObjs);
      if (selectedObjs.some(e => e.Name === event.currentTarget.parent.name)) {
        //Stop same element being added to select list twice
        console.log("found");
      }
      addList(
        event.currentTarget.name,
        event.currentTarget.graphics._fill.style
      );

      console.log(selectedObjs);
      padlock.classList.remove("fa-lock-open");
      padlock.classList.add("fa-lock");
    }
  }

  circle.addEventListener("mousedown", handlePress);
  function handlePress(event) {
    document.getElementById("selectedName").innerHTML =
      event.currentTarget.name;
    // Change Color in Card
    document.getElementById("selectedColor").value =
      event.currentTarget.graphics._fill.style;
    document.getElementById("namechange").value = "";

    // A mouse press happened.
    // Listen for mouse move while the mouse is down:
    //  event.addEventListener("mousemove", handleMove);
  }
  function handleMove(event) {
    // Check out the DragAndDrop example in GitHub for more
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
workBtn.onclick = function() {
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
};
// Init the array of positions
let savedPositions = [];
let allScenes = [];
// Populate when save button clicked
saveBtn.onclick = function() {
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
  allScenes.push(savedPositions);
  timeLine();
};

playBtn.onclick = () => {
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  let allIds = getIds();
  for (c = 0; c < allIds.length; c++) {
    let id = allIds[c];
    let thisVal = findPositions(id);

    let myTween = getElement();

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
        myTween.to(
          { x: thisVal[z].x, y: thisVal[z].y }

          // createjs.Ease.getPowInOut(4)
        );
      } else {
        goTween(myTween, thisVal[z]);
        console.log("in other positions");
      }
      function goTween(myTween, positions) {
        myTween.to(
          { x: positions.x, y: positions.y },
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
alignXBtn.addEventListener("click", alignX);
alignYBtn.addEventListener("click", alignY);
spaceYBtn.addEventListener("click", spaceY);
spaceXBtn.addEventListener("click", spaceX);
//Remove Positions from the current scene
scrapBtn.onclick = () => {
  console.log("here");
  selectedObjs = [];
  let padlock = document.getElementById("padlock");
  document.getElementById("selectedName2").innerHTML = "";
  document.getElementById("selectedName2").appendChild(padlock);
  document.getElementById("selectedNodes").innerHTML = "";
  padlock.classList.add("fa-lock-open");
  padlock.classList.remove("fa-lock");
  $(".alert").show();
  window.setTimeout(function() {
    $(".alert").alert("close");
  }, 3000);
};

function timeLine() {
  let copyCanvas = document.createElement("canvas");
  let sourceCanvas = document.getElementById("demoCanvas");
  copyCanvas.setAttribute("id", "dynamic");
  copyCanvas.height = 70;
  copyCanvas.width = 70;
  copyCanvas.style = "display:inline";
  copyCanvas.classList.add("border");
  copyCanvas.classList.add("border-primary");
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

  let sceneCount = document.getElementById("sceneInfo");
  let sceneTable = document.getElementById("scenes");
  let newTd = document.createElement("td");
  newTd.innerHTML = sceneCount.childElementCount + 1;
  newTd.classList.add("border");
  newTd.classList.add("rounded");
  sceneCount.appendChild(newTd);
  let newTd2 = document.createElement("td");
  newTd2.classList.add("border");
  newTd2.classList.add("rounded");
  newTd2.appendChild(copyCanvas);
  sceneTable.appendChild(newTd2);

  console.log("clicked it");
}

//Card Input
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

selectBtn.onclick = () => {
  let selBtn = document.getElementById("selectBtn");
  console.log(selectActive);
  if (selectActive === false) {
    console.log("should go here");
    selectActive = true;
    selBtn.classList.add("text-danger");
    document.getElementById("demoCanvas").style.cursor = "pointer";
  } else {
    console.log("hey");
    selectActive = false;
    selBtn.classList.remove("text-danger");
    document.getElementById("demoCanvas").style.cursor = "auto";
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

    stage.update();
  }
}
function alignX() {
  let x = selectedObjs[0].x;

  for (i = 0; i < selectedObjs.length; i++) {
    selectedObjs[i].x = x;

    stage.update();
  }
}

function spaceY() {
  let maxY = stage.canvas.clientHeight;
  let countNodes = selectedObjs.length;
  countNodes = countNodes + 1;
  let increment = maxY / countNodes;
  let incrementO = increment;

  for (i = 0; i < selectedObjs.length; i++) {
    x = i;

    if (x <= 0) {
      increment++;
      selectedObjs[i].y = increment;

      stage.update();
    }
    selectedObjs[i].y = increment;

    increment = increment + incrementO;
    stage.update();
  }
}

function spaceX() {
  let maxX = stage.canvas.clientWidth;
  let countNodes = selectedObjs.length;
  countNodes = countNodes + 1;
  let increment = maxX / countNodes;
  let incrementO = increment;

  for (i = 0; i < selectedObjs.length; i++) {
    y = i;

    if (y <= 0) {
      increment++;
      selectedObjs[i].x = increment;

      stage.update();
    }
    selectedObjs[i].x = increment;

    increment = increment + incrementO;
    stage.update();
  }
}
