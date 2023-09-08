
window.addEventListener('DOMContentLoaded', event => {
    console.log("Personal Area Script");


    // copertina click
    var openEditorCopertina = false;
    const editCopertinaBtn = document.querySelector("#edit-copertina-button");
    editCopertinaBtn.addEventListener("click", (evt) => {
        if(openEditorCopertina == false) {
            document.getElementById("upload-copertina-form").classList.remove("d-none");
            document.getElementById("edit-copertina-icon").classList.remove("fa-pencil");
            document.getElementById("edit-copertina-icon").classList.add("fa-times");
            openEditorCopertina = true;
        } else {
            document.getElementById("upload-copertina-form").classList.add("d-none");
            document.getElementById("edit-copertina-icon").classList.remove("fa-times");
            document.getElementById("edit-copertina-icon").classList.add("fa-pencil");
            openEditorCopertina = false;
        }
    });

});



// menù preview link
const linkInput = document.querySelector("#link-input");
linkInput.addEventListener("change", (evt) => {
    document.querySelector("#link-preview").innerHTML = linkInput.value;
});

