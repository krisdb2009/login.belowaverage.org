window.addEventListener("load", function(e) {
    var image = document.querySelector(".login-card .picture");
    var username = document.querySelector("input[name=username]");
    username.onchange = function() {
        console.log(username.value);
        image.style.backgroundImage = "url('https://api.belowaverage.org/v2/adphoto/?" + username.value + "')";
    };
});