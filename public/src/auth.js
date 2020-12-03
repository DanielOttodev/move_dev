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
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/home',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
};


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        console.log('yes user')
        console.log(user);
    } else {
        console.log(user)
        window.location = "login.html"
    }
});