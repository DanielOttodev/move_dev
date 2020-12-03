// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAOZjXCkLncGlHwnbqZ__jOo6c5nLi7yXU",
    authDomain: "movesapp-cf511.firebaseapp.com",
    databaseURL: "https://movesapp-cf511.firebaseio.com",
    projectId: "movesapp-cf511",
    storageBucket: "movesapp-cf511.appspot.com",
    messagingSenderId: "273327942126",
    appId: "1:273327942126:web:9db2bc0bbdfb60715fc6ff",
    measurementId: "G-BTYEY2J0SH"
};
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

firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
let myuser = firebase.auth().currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(myuser);
        console.log(user);
        window.location = "app.html"

    } else {
        // none
    }
})