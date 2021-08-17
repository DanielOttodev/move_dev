/// Splash screen


const newProjectBtn = document.getElementById('newProjectBtn')
const newProjectContent = document.getElementById('newProjectContent');
const loadScreen = document.getElementById('loadScreen');
const plusP = document.getElementById('plusPBtn')
const subP = document.getElementById('subP');
const countP = document.getElementById('countP');
const goBtn = document.getElementById("goBtn");
const cubeAnim = document.getElementById("cubeBoxContainer");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function goMain() {
  cubeAnim.style.display = "flex";
  const cubeTxt = document.getElementById('cubetext');

  cubeTxt.textContent = loadingMessage();
  newProjectContent.style.display = "none";
  console.log('Taking a break...');
  await sleep(3000);
  console.log('Two seconds later, showing sleep in a loop...');

  // Sleep in loop
  for (let i = 0; i < 5; i++) {
    if (i === 3)
      await sleep(3000);
  }
  let extra = document.getElementById("extraContent")
  let splash = document.getElementById("splashScreen")
  let main = document.getElementById("mainContent")

  main.style.display = "block"
  extra.style.display = "block"
  splash.style.display = "none"
  start();
}

let myMessages = [
  'SETTING THE STAGE',
  'JUST TIDYING UP',
  'GETTING COFFEE! ALMOST THERE',
  'POLISHING THE FLOOR',
  'I FEEL LIKE I SHOULD BE LOADING SOMETHING? OH HERE WE GO',
  'BAKING A COOKIE FOR YOU',
  'TYING SHOE LACES...',
  'AND 5, 6 , 7 , 8!',
  'AM I MEANT TO BE ON STAGE?',
  'TAKE IT FROM THE TOP!',
  'FORGOT MY COSTUME, HOLD ON',
  'ENTERING FROM STAGE RIGHT',
  'GIVE ME A BEAT',
  'GRABBING EXTRA MINIONS',
  'STILL STRETCHING...',
  'YOU ARE 1293283 IN QUEUE...',
  'WHATS A BALLERINAS FAVORITE NUMBER? TWO-TWO!',
  'ROCK - PAPER - STAGE!'
]

function loadingMessage() {
  let msg = myMessages[Math.floor(Math.random() * myMessages.length)];
  return msg;
}

function plusPerson() {
  var x = parseInt(countP.textContent);
  x = x + 1;
  countP.textContent = x.toString();

}

function init() {}

function subPerson() {
  var x = parseInt(countP.textContent)
  if (x > 0) {
    x = x - 1;
  }
  countP.textContent = x.toString();
}

newProjectBtn.onclick = (e) => {
  loadScreen.style.display = 'none';
  newProjectContent.style.display = 'block';
}


// Globals
//// Main Application 

function start() {
  console.log('Initialising');
  var x = parseInt(countP.textContent);
  for (i = 0; i < x; i++) {
    addNodes()
  }
}

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



// Add New Shape Button

function addNodes() {
  var circle = new createjs.Shape();
  //VARIABLES
  //Drag Object Size
  dragRadius = 80;

  //Circle Create
  circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, 23);
  circle.x = 7;
  circle.y = 7;

  var dragger = new createjs.Container();
  dragger.name =  stage.children.length + 1   //`New${stage.children.length + 1}`;
  circle.name = dragger.name;
  // Label
  var label = new createjs.Text(circle.name, "Bold 28px ", "#fff");

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
      id: stage.children[i].id,
      
    };
    console.log(i);
    savedPositions.push(this.formation);
    console.log(savedPositions[i]);
  }
  let savedPosNotes = {  // Need to store this as an object for Firestore - Doesn't have any other interaction with front end
    notes:notes,
    id:allScenes.length
  }
  savedPositions.push(savedPosNotes); 
  savedPositions.notes = notes;
  savedPositions.id = allScenes.length
  //savedPositions.push(details)
  allScenes.push(savedPositions);
  console.log('allscenes- save');
  console.log(allScenes);
  timeLine(notes);
  document.getElementById("formationNotes").value = "";
};

playBtn.onclick = () => {
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  let allIds = getIds();
  for (c = 0; c < allIds.length; c++) {
    console.log(allIds);
    let id = allIds[c];
    let thisVal = findPositions(id);
    let myTween = getElement();

    function getElement() {
      console.log(c);
      for (i = 0; i < stage.children.length; i++) {
        console.log(stage.children[i]);  
        if ((stage.children[i].id == id)) { // This was = & stage.children[i] was children[c]
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

  drawCentre();
};

// Create the Timeline of scenes
function timeLine(notes) {
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
  rubbishButton.setAttribute("id", canvasId + '-RmBtn')
  newTd.appendChild(rubbishButton);
  if (notes != "") {
    let notesBtn = document.createElement("i")
    notesBtn.classList.add("hasNotes");
   
  notesBtn.setAttribute("id", canvasId + "-noteBtn")
  notesBtn.classList.add("fa-scroll");
  notesBtn.classList.add("fas")
  notesBtn.classList.add("notesBtn")
  notesBtn.onclick = (e) => {
    let id = e.target.id.substr(0, e.target.id.indexOf('_'));
    let index = allScenes.findIndex(x => x.id == id)
    if (index > -1) {
      let notes = allScenes[index].notes;
      console.log(notes);
      buildNoteModal(notes);
    }
  }
  newTd.appendChild(notesBtn);
  }


 
  rubbishButton.onclick = (e) => {
    // var houseIndex = street.houses.findIndex(h => h.rooms.some(r => r.id === roomId));
    let id = e.target.id.substr(0, e.target.id.indexOf('_')); // Id of the scene to remove;
    let index = allScenes.findIndex(x => x.id == id)

    let rmCanvasId = e.target.id.substr(0, e.target.id.indexOf('-'));
    let rmCanvas = document.getElementById(rmCanvasId);
    if (index > -1) {
      allScenes.splice(index, 1);
      rmCanvas.parentElement.parentElement.remove()
      let tdinfos = document.getElementsByClassName("sceneTdInfo")
      e.target.parentElement.remove()
      for (var x = 0; x < tdinfos.length; x++) {
        tdinfos[x].innerHTML = x + 1;
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
  console.log(myArray);
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
    let pos = increment * i + 1

    selectedObjs[i].y = pos;
    groupedOffset[i].y = pos - handler.y
    stage.update();
  }
}

function spaceX() { // 
  let maxX = stage.canvas.clientWidth;
  console.log(maxX);
  let countNodes = selectedObjs.length;
  countNodes = countNodes + 1;
  let increment = maxX / countNodes;

  for (i = 0; i < selectedObjs.length; i++) {
    let pos = increment * i + 1
    console.log(pos);
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
// Save Modal & Confirm + Form validation
const saveAll = document.getElementById('saveAll')
const projectName = document.getElementById('projectName');
saveAll.addEventListener('click', (e) => {

  e.preventDefault;
  $('#saveModal').modal('toggle')
  /*
    let allSceneObj = Object.assign({}, allScenes); // {0:"a", 1:"b", 2:"c"}
    console.log(allSceneObj)
    db.collection('UserRoutines').add(allSceneObj);*/
})
// Check form, check DB for same ID routine, then save.
function saveConfirm() {
  let uid = firebase.auth().currentUser.uid
  let pjname = projectName.value
  // Check form has input atleast 3 chars
  console.log(pjname)
  if (pjname != '') {

    if (pjname.length > 3) {
      // Check DB for same project name for User
      pjname = pjname.replace(/ /s,'');
      var docRef = db.collection(uid).doc("SavedRoutines").collection(pjname).doc(pjname)
      docRef.get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          alert('A routine already exists with this name')
        } else {
         
             pjname = pjname.replace(/ /s,'');
              let allSceneObj = Object.assign({}, allScenes);
              allSceneObj.name = 'hello'
              db.collection(uid).doc("SavedRoutines").collection(pjname).doc(pjname).set(allSceneObj)  // Write the object to SaveRoutines collection
            .then(() => {          
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
            db.collection(uid).doc("RoutinesList").collection("UserRoutinesList").doc(pjname).set({"routineName": pjname})  // Write the item to AllRoutines collection for listing
            .then(() => {
              let modalsave = document.getElementById("saveModalContent")
              modalsave.classList.add("successMsg");
              $('#saveModal').modal('toggle')
             
              console.log("Listing successfully written!");
            })
            .catch((error) => {
              console.error("Error writing listing: ", error);
            });
            
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    } else {
      alert('Project name must be atleast 3 characters');
    }

  } else {
    alert('Project name must be atleast 3 characters')
  }
}
function buildNoteModal(notes) {
  let modalBody = document.getElementById("modalBody")
  modalBody.textContent = notes;
  $('#mymodal').modal('toggle');
}

function drawCentre() {
  var canvas = document.getElementById("demoCanvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "#9baacf";
  ctx.fillText("Centre", 600, 300);
}
/*
new DragSelect({
  selectables: document.getElementsByClassName('mStage'),
  //area: document.getElementsByClassName('mStage')
});*/


 function testFunc(){
  console.log(stage.children)

}


function loadProject(){ // Load a specified(pjname) project -- 
  console.log('clicked');
  let pjname = "NewProject"
  console.log("Getting docs..")
  let uid = firebase.auth().currentUser.uid
  console.log(uid);
  var docRef = db.collection(uid).doc("SavedRoutines").collection(pjname).doc(pjname)

  docRef.get().then((doc) => {
      if (doc.exists) {
        let loadedData = doc.data();

        for (i=0;i<loadedData.length;i++){
        loadedData[i] = loadedData[i].splice(-1,1);
        }
        importScene(loadedData);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
}

function importScene(scenes){ // Pass in scenes from Firestore, Add nodes , Redraw the canvases.
  let myArr = []
  let noteArr = []
  let myscenes = []
  myArr.push(scenes);

  var size = Object.keys(myArr[0]).length;
  size = size - 1 // for array iteration
  for(x=0;x<size;x++){
  noteArr.push(myArr[0][x][myArr[0][x].length - 1])
  myArr[0][x].splice(-1,1);
  console.log('myarr');
  console.log(myArr);
  console.log(myArr[0][x]);
  myscenes.push(myArr[0][x])

  addNodes();
  }
  for(x=0;x<noteArr.length;x++){ // note arr length will always be the same as routine array
    stage.children[x].x = myscenes[x].x
    stage.children[x].x= myscenes[x].y  
    stage.update();
    buildScene(myscenes[x],noteArr[x])  
    }
    
}

function buildScene(arr,sceneNotes)  { // Wrong thing beind passed in here?
  console.log('here')
  let mynotes = sceneNotes.notes
  console.log(arr);
  let savedPositions = [];
  for (i = 0; i < arr.length; i++) {
    formation = {
      name: arr[i].name,
      x: arr[i].x,
      y: arr[i].y,
      id: arr[i].id,
      
    };
    console.log(formation);
    savedPositions.push(formation);
  }
  let savedPosNotes = {  // Need to store this as an object for Firestore - Doesn't have any other interaction with front end -- Not needed for loading
    notes:mynotes,
    id:allScenes.length
  }
 // savedPositions.push(savedPosNotes); 
 savedPositions.notes = mynotes;
  savedPositions.id = allScenes.length
  //savedPositions.push(details)
  allScenes.push(savedPositions);
  console.log('logging all scenes');
  console.log(allScenes)
  timeLine(mynotes);
  document.getElementById("formationNotes").value = "";
};