console.log("Menu JS Installed!");


$(function() {
    // funzione all'avvio
    const idOrari = $('#orari').attr("data-orari-id");
    $.get( "/api/orari/info/"+idOrari, function( data ) {
        //console.log(JSON.parse(data.object.orariObjString));
        
        // sistemo i dati in una visual e genero la stringa "Apre alle" o "Chiude alle"
        const isOpenTemp = isOpen(JSON.parse(data.object.orariObjString));
        visualChiusoAperto(isOpenTemp);
        writeNextOpening(JSON.parse(data.object.orariObjString), isOpenTemp);

        //inserisco i dati nella tabella
        insertIntoOrariTable(JSON.parse(data.object.orariObjString));

    }).fail(function() {
        console.log("Error Orari");
    });

});




var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


function isOpen(data) {
    // passo tutta la struttura dati
    var isOpen = false; // default è chiuso

    const today = new Date();
    var indexDay = today.getDay() == 0 ? 6 : today.getDay()-1;
    var currentDayInfo = data[indexDay];    // prendo le informazioni solo di oggi

    if(currentDayInfo.dayOpen) {
        if(currentDayInfo.allDay) {
            // orario continuato
            const start = setHoursAndMinutes(currentDayInfo.allDayStart);
            const end = setHoursAndMinutes(currentDayInfo.allDayEnd);
            if(beetwen(start, today, end)) {isOpen = true; }
        } else {
            // mattina e pomeriggio
            const startM = setHoursAndMinutes(currentDayInfo.morningStart);
            const endM = setHoursAndMinutes(currentDayInfo.morningEnd);

            const startP = setHoursAndMinutes(currentDayInfo.afternoonStart);
            const endP = setHoursAndMinutes(currentDayInfo.afternoonEnd);

            if(beetwen(startM, today, endM) && currentDayInfo.morning ) {
                // se ti trovi in mezzo alla mattina e di mattina è aperto!
                isOpen = true;
            }

            if(beetwen(startP, today, endP) && currentDayInfo.afternoon ) {
                // se ti trovi in mezzo pomeriggio e di pomeriggio è aperto!
                isOpen = true;
            }
        }
    }

    return isOpen;
}


function visualChiusoAperto(boolAperto) {
    // questa funzione cambia la scritta da chiuso ad aperto e viceversa
    // true: aperto | false: chiuso
    if(boolAperto) {
        $('#orari-apertura-text-status').text('Aperto');
        $('#orari-apertura-text-status').addClass("open");
    } else {
        $('#orari-apertura-text-status').text('Chiuso');
        $('#orari-apertura-text-status').addClass("closed");
    }
}


function writeNextOpening(data, open_bool) {
    // funzione inerente gli orari che dice la prossima apertura o chiusura

    const today = new Date();
    var indexDay = today.getDay() == 0 ? 6 : today.getDay()-1;
    var currentDayInfo = data[indexDay];    // prendo le informazioni solo di oggi
    
    if(open_bool) { 
        // siamo aperti, calcola la prossima chiusura
        if(currentDayInfo.allDay) {
            // orario continuato
            $('#orari-apertura-text-orario').text('Chiude alle ' + currentDayInfo.allDayEnd);
        } else {
            // non è orario continuato
            const startM = setHoursAndMinutes(currentDayInfo.morningStart);
            const endM = setHoursAndMinutes(currentDayInfo.morningEnd);
            const startP = setHoursAndMinutes(currentDayInfo.afternoonStart);
            const endP = setHoursAndMinutes(currentDayInfo.afternoonEnd);

            if( beetwen(startM, today, endM) ) {
                $('#orari-apertura-text-orario').text('Chiude alle ' + currentDayInfo.morningEnd);
            } else if( beetwen(startP, today, endP) ) {
                $('#orari-apertura-text-orario').text('Chiude alle ' + currentDayInfo.afternoonEnd);
            }
        }

        $('#orari-apertura-text-orario').addClass("open"); 
    } else { 
        // CHIUSO
        if(currentDayInfo.dayOpen == false) {
            // oggi chiuso perchè è chiuso tutto il giorno
            $('#orari-apertura-text-orario').text('');
        } else {
            // chiuso ma non tutto il giorno, posso scrivere a che ore riapre
            const mezzanotte = setHoursAndMinutes('00:00');
            const startM = setHoursAndMinutes(currentDayInfo.morningStart);
            const endM = setHoursAndMinutes(currentDayInfo.morningEnd);
            const startP = setHoursAndMinutes(currentDayInfo.afternoonStart);
            const endP = setHoursAndMinutes(currentDayInfo.afternoonEnd);
            
            if( beetwen(mezzanotte, today, startM) && currentDayInfo.morning) {
                $('#orari-apertura-text-orario').text('Apre alle ' + currentDayInfo.morningStart);
            } else if( beetwen(mezzanotte, today, startP) && currentDayInfo.afternoon ) {
                $('#orari-apertura-text-orario').text('Apre alle ' + currentDayInfo.afternoonStart);
            }
        }

        $('#orari-apertura-text-orario').addClass("closed"); 
    }
    
}



// funzione ausiliaria che crea l'orario controntabile
// dalla stringa, UTILISSIMA
function setHoursAndMinutes(timeString) {
    var date = new Date();
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);

    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}


function beetwen(d1, d2, d3) {
    // funzione che ritorna true se d1 <= d2 <= d3
    if(d1 < d2) {
        if(d2 < d3) {
            return true;
        }
    }
    return false;
}


function insertIntoOrariTable(data) {
    const orariItems = document.getElementsByClassName("orari-table-item");
    
    for(index in data) {
        var tempTD = document.createElement("td");

        if(data[index].dayOpen == false) {
            tempTD.innerHTML = "CHIUSO";
        } else {
            if(data[index].allDay == true) {
                tempTD.innerHTML = data[index].allDayStart+" - "+data[index].allDayEnd;
            } else {
                if(data[index].morning == true) {
                    tempTD.innerHTML = data[index].morningStart+" - "+data[index].morningEnd;

                    if(data[index].afternoon == true) {
                        tempTD.innerHTML += " || ";
                    }
                }
                if(data[index].afternoon == true) {
                    tempTD.innerHTML += data[index].afternoonStart+" - "+data[index].afternoonEnd;
                }
            }
        }
        
        orariItems[index].appendChild(tempTD);
    }

}