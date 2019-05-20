$(document).ready(function() {
    $("#SignUp").hover(function() {
        $(this).css("background-color", "#0CAA55");
    }, function() {
        $(this).css("background-color", "#464646");
    });

    $("#SignUp").on("click", function() {
        window.location = "../Login/login.html";
    });
});