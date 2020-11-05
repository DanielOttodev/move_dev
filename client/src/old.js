// code here.'
function init() {
  var circle = new createjs.Shape();
  //VARIABLES
  //Drag Object Size
  dragRadius = 40;

  //Circle Create
  var label = new createjs.Text("Daniel Otto", "14px", "black");
  label.textAlign = "center";
  // label.textBaseline = "middle";

  label.y -= 0;
  label.x = 5;
  circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, 30);
  circle.x = 7;
  circle.y = 7;

  var dragger = new createjs.Container();
  dragger.x = dragger.y = 100;
  dragger.addChild(circle, label);
  dragger.setBounds(100, 100, dragRadius, dragRadius);
  dragger.name = "theOG";
  circle.name = dragger.name;
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
}
