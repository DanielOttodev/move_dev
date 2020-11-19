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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
// Get Cookie

const submitBtn = document.getElementsByClassName('firebaseui-id-submit')
console.log(submitBtn)

submitBtn.addEventListener("submit", (event) => {
    console.log(event)
    event.preventDefault();
    const login = event.target.login.value;
    const password = event.target.password.value;

    firebase
        .auth()
        .signInWithEmailAndPassword(login, password)
        .then(({
            user
        }) => {
            return user.getIdToken().then((idToken) => {
                return fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({
                        idToken
                    }),
                });
            });
        })
        .then(() => {
            return firebase.auth().signOut();
        })
        .then(() => {
            window.location.assign("/profile");
        });
    return false;
});