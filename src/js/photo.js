window.addEventListener("load", function(e) {
    var image = document.querySelector(".login-card .picture");
    var username = document.querySelector("input[name=username]");
    username.onchange = function() {
        xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.belowaverage.org/adphoto/?' + username.value + '');
        xhr.responseType = 'blob';
        xhr.onload = function() {
            conType = xhr.getResponseHeader('Content-Type');
            if(!conType.includes('text')) {
                img = URL.createObjectURL(xhr.response);
                image.style.backgroundImage = "url('" + img + "')";
            } else {
                image.style.backgroundImage = '';
            }
        };
        xhr.send();
    };
});