// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var uiConfig = {
    callbacks: {


        uiShown: function () {
            document.getElementById('loader').style.display = 'none';
        }
    },

    signInFlow: 'popup',
    signInSuccessUrl: '/home',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
let user1 = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //send to app.html if user authenticates.
        window.location = "app.html"

    } else {
        //none
    }
});

function signOut() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}