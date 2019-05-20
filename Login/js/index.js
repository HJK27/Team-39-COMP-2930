// function initFirebaseAuth() {
// 	// Listen to auth state changes.
// 	firebase.auth().onAuthStateChanged(authStateObserver);
// }

var email;

// function getEmail() {
// 	return firebase.auth().currentUser.email;
// }

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.email);
    email = user.email;
    console.log(email);
    // User is signed in.
    document.getElementById("").innerHTML = "Hello " + email + "!";
    document.getElementById("Login--logout").innerHTML = "Logout";
    $("#Login--logout").on("click", logout);
  } else {
    document.getElementById("Login--logout").innerHTML = "Login";
    // No user is signed in.
  }
});





function logout() {
    firebase.auth().signOut().then(function() {
      window.location = 'login.html';
    }).catch(function(error) {
      // An error happened.
    });
    }

