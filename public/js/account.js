var menuCategories = document.getElementById('menu-categories');
var menuId = menuCategories.dataset.menuId;
$.getJSON("/api/menu/getMenuFromId/advancedMode/"+menuId, function (res) {

    for (let i = 0; i < res.categorie.length; i++) {
        // console.log(res.categorie[i].name);

        var newDetails = document.createElement('details');
        var newSummary = document.createElement('summary');
        newSummary.innerHTML = res.categorie[i].name;

        // pulsate elimina categoria
        var C_deleteLink = document.createElement('a');
        C_deleteLink.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
        C_deleteLink.href = "/api/menu/deleteSubMenu/" + res.categorie[i]._id + "?menu_id=" + menuId;
        C_deleteLink.classList.add('menu-delete-button');
        newSummary.appendChild(C_deleteLink);


        // pulsanti SPOSTA SUBMENU
        if(i != 0) {
            // metto il pulsante SU solo se non è la prima categoria
            var C_upLink = document.createElement('a');
            C_upLink.innerHTML = '<i class="fa fa-arrows" aria-hidden="true"></i>';
            C_upLink.href = "/api/menu/upSubMenu/" + res.categorie[i]._id + "?menu_id=" + menuId;
            C_upLink.classList.add('menu-up-button');
            newSummary.appendChild(C_upLink);
        }
        // Fine pulsanti SPOSTA SUBMENU


        var newListaPiatti = document.createElement('div');
        newListaPiatti.classList.add('menu-lista-piatti');

        for (let j = 0; j < res.categorie[i].piatti.length; j++) {
            var tempSinglePiatto = document.createElement('div');
            tempSinglePiatto.classList.add('menu-single-piatto');

            // aggiungo nome piatto e prezzo
            var tempH4 = document.createElement('h4');
            tempH4.innerHTML = res.categorie[i].piatti[j].name;
            var tempPrice = document.createElement('price');
            tempPrice.innerHTML = res.categorie[i].piatti[j].price;
            // creo la X
            var deleteX = document.createElement('a');
            deleteX.href = "/api/menu/deletePiatto/" + 
                res.categorie[i].piatti[j]._id + "?submenu_id=" + 
                res.categorie[i]._id + "&menu_id=" + res._id;
            deleteX.classList.add("menu-delete-button");
            deleteX.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
            tempH4.appendChild(tempPrice);
            tempH4.appendChild(deleteX);
            if(j > 0) {
                // creao il tasto SPOSTA PIATTO
                var movePiatto = document.createElement('a');
                movePiatto.href = "/api/menu/upPiatto/" + 
                res.categorie[i].piatti[j]._id + "?submenu_id=" + 
                res.categorie[i]._id + "&menu_id=" + res._id;
                movePiatto.classList.add("menu-up-button");
                movePiatto.innerHTML = '<i class="fa fa-arrows" aria-hidden="true"></i>';
                tempH4.appendChild(movePiatto);
            }
            tempSinglePiatto.appendChild(tempH4);
            

            // aggiungo descrizione piatto
            var tempP = document.createElement('p');
            tempP.innerHTML = res.categorie[i].piatti[j].description;
            tempSinglePiatto.appendChild(tempP);

            // creazione del form per MODIFICA PREZZO
            var modifica_form = document.createElement('form');
            modifica_form.action = "/api/menu/editPiatto/" + res.categorie[i].piatti[j]._id;
            modifica_form.method = "POST";
            var prezzo_in = document.createElement('input');
            prezzo_in.type = "text";
            prezzo_in.classList.add("update-price-input");
            prezzo_in.name = "new_value";
            prezzo_in.placeholder = "Aggiorna prezzo (€)";
            var menu_id_in = document.createElement('input');
            menu_id_in.type = "hidden";
            menu_id_in.name = "menu_id";
            menu_id_in.value = res._id;
            var action_in = document.createElement('input');
            action_in.type = "hidden";
            action_in.name = "action";
            action_in.value = "price";
            modifica_form.appendChild(prezzo_in);
            modifica_form.appendChild(menu_id_in);
            modifica_form.appendChild(action_in);

            tempSinglePiatto.appendChild(modifica_form);

            newListaPiatti.appendChild(tempSinglePiatto);
        }

        // creazione del form a fine categoria
        var divForm = document.createElement('div');            // div che contiene il form
        divForm.classList.add('menu-single-piatto');
        var formNewPiatto = document.createElement('form');     // form
        formNewPiatto.method = "post";
        formNewPiatto.classList.add('new-piatto-form');
        formNewPiatto.action = "/api/menu/createPiatto";
        var divInForm = document.createElement('div');          // div dentro il form
        divInForm.classList.add("row", "py-0");
        // iniziano gli input
        // input UNO Nome
        var firstCol = document.createElement("div");
        firstCol.classList.add("col-9", "name-piatto-input");
        var nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.name = "name";
        nameInput.required = true;
        nameInput.placeholder = "Nome";
        firstCol.appendChild(nameInput);
        // input DUE Prezzo
        var secondCol = document.createElement("div");
        secondCol.classList.add("col-3", "prezzo-input");
        var prezzoInput = document.createElement("input");
        prezzoInput.type = "text";
        prezzoInput.name = "prezzo";
        prezzoInput.required = true;
        prezzoInput.placeholder = "(€)";
        secondCol.appendChild(prezzoInput);
        // input TRE Descrizione
        var terzaCol = document.createElement("div");
        terzaCol.classList.add("col-12", "ingredienti-input");
        var descrizioneInput = document.createElement("input");
        descrizioneInput.type = "text";
        descrizioneInput.name = "descrizione";
        descrizioneInput.required = true;
        descrizioneInput.placeholder = "Descrizione";
        terzaCol.appendChild(descrizioneInput);
        // input QUATTRO hidden submenu_id
        var submenuInput = document.createElement("input");
        submenuInput.type = "hidden";
        submenuInput.name = "submenu_id";
        submenuInput.value = res.categorie[i]._id;
        // input CINQUE hidden submenu_id
        var menuInput = document.createElement("input");
        menuInput.type = "hidden";
        menuInput.name = "menu_id";
        menuInput.value = res._id;
        // input SEI Submit button
        var quartaCol = document.createElement("div");
        quartaCol.classList.add("col-12", "submit-button-input");
        var submitbtn = document.createElement("input");
        submitbtn.type = "submit";
        submitbtn.value = "Inserisci";
        submitbtn.placeholder = "Descrizione";
        quartaCol.appendChild(submitbtn);
        // mettiamo tutto al posto giusto
        divInForm.appendChild(submenuInput);
        divInForm.appendChild(menuInput);
        divInForm.appendChild(firstCol);
        divInForm.appendChild(secondCol);
        divInForm.appendChild(terzaCol);
        divInForm.appendChild(quartaCol);
        formNewPiatto.appendChild(divInForm);
        divForm.appendChild(formNewPiatto);
        newListaPiatti.appendChild(divForm);
        // fine del form di inserimento


        newDetails.appendChild(newSummary);
        newDetails.appendChild(newListaPiatti);

        menuCategories.appendChild(newDetails);
    }

});