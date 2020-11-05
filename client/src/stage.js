// Globals
var stage = new createjs.Stage("demoCanvas");

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
    console.log("Clicked on object");
  }

  circle.addEventListener("mousedown", handlePress);
  function handlePress(event) {
    console.log(event);
    console.log(event.currentTarget.name);
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
const tempBtn = document.getElementById("tempBtn");

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
// Populate when save button clicked
saveBtn.onclick = function() {
  for (i = 0; i < stage.children.length; i++) {
    this.shape = {
      name: stage.children[i].name,
      x: stage.children[i].x,
      y: stage.children[i].y,
      id: stage.children[i].id
    };
    console.log(i);
    savedPositions.push(this.shape);
    console.log(savedPositions[i]);
  }
};

playBtn.onclick = () => {
  console.log("clicked");
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  for (i = 0; i < stage.children.length; i++) {
    if ((stage.children[i].id = savedPositions[i].id)) {
      createjs.Tween.get(stage.children[i]).to(
        { x: savedPositions[i].x, y: savedPositions[i].y },
        2000,
        createjs.Ease.getPowInOut(4)
      );
    } else {
      console.log("no id match");
    }
  }
};
//Remove Positions from the current scene
scrapBtn.onclick = () => {
  savedPositions = [];
  alert("All positions removed..");
};

tempBtn.onclick = () => {
  let copyCanvas = document.createElement("canvas");
  let sourceCanvas = document.getElementById("demoCanvas");
  copyCanvas.setAttribute("id", "dynamic");
  copyCanvas.height = 50;
  copyCanvas.width = 50;
  copyCanvas.style = "display:inline";
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
  newTd.innerHTML = 2;
  sceneCount.appendChild(newTd);
  let newTd2 = document.createElement("td");
  newTd2.appendChild(copyCanvas);
  sceneTable.appendChild(newTd2);

  console.log("clicked it");
};

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
  console.log("Made it");
  console.log(e);

  let selectedObj = stage.getChildByName(
    document.getElementById("selectedName").innerHTML
  );
  console.log(selectedObj);
  selectedObj.children[0].graphics._fill.style = document.getElementById(
    "selectedColor"
  ).value;

  stage.update(); // Update stage so takes place immediately instead of after moving the shape
};
