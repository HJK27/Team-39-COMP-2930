firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("login--logout").innerHTML = "Logout";
    $("#login--logout").on("click", logout);
  } else {
    document.getElementById("login--logout").innerHTML = "Login";
    $("#login--logout").on("click", toLogin);
  }
});

function toLogin() {
    window.location = '../Login/login.html';
}

function logout() {
    firebase.auth().signOut().then(function() {
      window.location = '../Login/login.html';
    }).catch(function(error) {
      // An error happened.
    });
  }