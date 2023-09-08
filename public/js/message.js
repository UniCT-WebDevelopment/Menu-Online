/* Gestione Errore */
var url_string = window.location.href;
var url = new URL(url_string);
var error = url.searchParams.get("error");

if(error) {
    $("#message-view").show(400);
    if(error == "false") {
        document.getElementById("success-message").style.display = "block";
    } else if(error == "true"){
        document.getElementById("error-message").style.display = "block";
    }

    setTimeout(function(){ 
        $("#message-view").hide(500);
    }, 6000);

} else {
    console.log("no error");
}