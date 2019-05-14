firebase.auth().onAuthStateChanged(user => {
  if (user) {
      window.location = 'index.html';
  }
});

function login() {
	
	var userEmail = document.getElementById("email_login").value;
	var userPw = document.getElementById("pw_login").value;
	
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPw).catch(function(error) {
    // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert("Error: "  + errorMessage);
    });
}


function signup() {
	
  var newEmail = document.getElementById("email_signup").value;
  var newPass = document.getElementById("pw_signup").value;
  
  
  firebase.auth().createUserWithEmailAndPassword(newEmail, newPass).catch(function(error) {
   //Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  window.alert("Error: "  + errorMessage);
  });
} 


function signInWithGoogle() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);

}



  