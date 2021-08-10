const slider = document.getElementById("formControlRange");


$('html, body').on('dragstart', function (e)
{
  e.preventDefault();
});
// const db = firebase.firestore(); -- Not needed?
let output = document.getElementById("speedValue");
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();

  $(".alert").hide();
});

slider.oninput = function () {
  console.log("inputed");
  output.innerHTML = this.value;
  slider.value = this.value;
};

const bgtoggle = document.getElementById("bgtoggle");
bgtoggle.onclick = () => {
  let stage = document.getElementById("demoCanvas");
  if (bgtoggle.value != "checked") {
    stage.classList.add("bgCourt");
    bgtoggle.value = "checked";
  } else {
    stage.classList.remove("bgCourt");
    bgtoggle.value = "unchecked";
  }
};
const gridtoggle = document.getElementById("gridtoggle");
gridtoggle.onclick = () => {
  let stage = document.getElementById("demoCanvas");
  if (gridtoggle.value != "checked") {
    stage.classList.add("grid");
    gridtoggle.value = "checked";
  } else {
    stage.classList.remove("grid");
    gridtoggle.value = "unchecked";
  }
};

function findRoutines(event) {
  let value = document.getElementById('submitValue').value
  while (carList.firstChild) {
    carList.removeChild(carList.firstChild);
  }
  event.preventDefault()
  console.log(event)
  console.log('submit')
  console.log(value)
  db.collection('Cars').where('registration', '==', value).get().then((snapshot) => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      renderDocs(doc)
    })
  }, noResult)
}