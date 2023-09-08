$(function() {
    // on load
    const idOrari = $('#orari').attr("data-orari-id");
    $.get( "/api/orari/info/"+idOrari, function( data ) {
        if(data.object.enable) {
            // funzione attiva
            $('#save-orari-button').prop('disabled', false);
            changeStatusForm(false);
        } else {
            // funzione disattiva
            $('#save-orari-button').prop('disabled', true);
            changeStatusForm(true);
        }

        loadTable( JSON.parse(data.object.orariObjString) );
    });

});


function loadTable(data) {
    console.log(data);
    var nDay = 0;
    for(dayInfo of data) {
        $("#"+days[nDay]+"-check-day").prop('checked', dayInfo.dayOpen);
        disableAllDay(days[nDay], dayInfo.dayOpen);

        $("#"+days[nDay]+"-check-morning").prop('checked', dayInfo.morning);
        $("#"+days[nDay]+"-hour-morning-start").prop('disabled', !dayInfo.morning);
        $("#"+days[nDay]+"-hour-morning-end").prop('disabled', !dayInfo.morning);


        $("#"+days[nDay]+"-check-afternoon").prop('checked', dayInfo.afternoon);
        $("#"+days[nDay]+"-hour-afternoon-start").prop('disabled', !dayInfo.afternoon);
        $("#"+days[nDay]+"-hour-afternoon-end").prop('disabled', !dayInfo.afternoon);
        
        
        $("#"+days[nDay]+"-check-allday").prop('checked', dayInfo.allDay);
        $("#"+days[nDay]+"-hour-allday-start").prop('disabled', !dayInfo.allDay);
        $("#"+days[nDay]+"-hour-allday-end").prop('disabled', !dayInfo.allDay);
        

        


        $("#"+days[nDay]+"-hour-morning-start").val(dayInfo.morningStart);
        $("#"+days[nDay]+"-hour-morning-end").val(dayInfo.morningEnd);

        $("#"+days[nDay]+"-hour-afternoon-start").val(dayInfo.afternoonStart);
        $("#"+days[nDay]+"-hour-afternoon-end").val(dayInfo.afternoonEnd);

        $("#"+days[nDay]+"-hour-allday-start").val(dayInfo.allDayStart);
        $("#"+days[nDay]+"-hour-allday-end").val(dayInfo.allDayEnd);

        nDay++;
    }
}


function changeStatusForm(enable) {
    // true disabilito form
    // false abilito form
    if(enable) { $("#orari-apertura-table").find("*").attr("disabled", "disabled"); }
    else { $("#orari-apertura-table").find("*").attr("disabled", false); }
}


var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


// MONDAY
$('#monday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) {
        changeStatusOfDay("monday", true);
    } else {
        changeStatusOfDay("monday", false);
    }
});

$('#monday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) {
        changeStatusMorning("monday", true);
    } else {
        changeStatusMorning("monday", false);
    }
});

$('#monday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) {
        changeStatusAfternoon("monday", true);
    } else {
        changeStatusAfternoon("monday", false);
    }
});

$('#monday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) {
        changeStatusAllDay("monday", true);
    } else {
        changeStatusAllDay("monday", false);
    }
});
// END MONDAY


// TUESDAY
$('#tuesday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("tuesday", true); } 
    else { changeStatusOfDay("tuesday", false); }
});

$('#tuesday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("tuesday", true); } 
    else { changeStatusMorning("tuesday", false); }
});

$('#tuesday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("tuesday", true); } 
    else { changeStatusAfternoon("tuesday", false); }
});

$('#tuesday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("tuesday", true); } 
    else { changeStatusAllDay("tuesday", false); }
});
// END TUESDAY


// wednesday
$('#wednesday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("wednesday", true); } 
    else { changeStatusOfDay("wednesday", false); }
});

$('#wednesday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("wednesday", true); } 
    else { changeStatusMorning("wednesday", false); }
});

$('#wednesday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("wednesday", true); } 
    else { changeStatusAfternoon("wednesday", false); }
});

$('#wednesday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("wednesday", true); } 
    else { changeStatusAllDay("wednesday", false); }
});
// END wednesday



// thursday
$('#thursday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("thursday", true); } 
    else { changeStatusOfDay("thursday", false); }
});

$('#thursday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("thursday", true); } 
    else { changeStatusMorning("thursday", false); }
});

$('#thursday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("thursday", true); } 
    else { changeStatusAfternoon("thursday", false); }
});

$('#thursday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("thursday", true); } 
    else { changeStatusAllDay("thursday", false); }
});
// END thursday




// friday
$('#friday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("friday", true); } 
    else { changeStatusOfDay("friday", false); }
});

$('#friday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("friday", true); } 
    else { changeStatusMorning("friday", false); }
});

$('#friday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("friday", true); } 
    else { changeStatusAfternoon("friday", false); }
});

$('#friday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("friday", true); } 
    else { changeStatusAllDay("friday", false); }
});
// END friday




// saturday
$('#saturday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("saturday", true); } 
    else { changeStatusOfDay("saturday", false); }
});

$('#saturday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("saturday", true); } 
    else { changeStatusMorning("saturday", false); }
});

$('#saturday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("saturday", true); } 
    else { changeStatusAfternoon("saturday", false); }
});

$('#saturday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("saturday", true); } 
    else { changeStatusAllDay("saturday", false); }
});
// END saturday




// sunday
$('#sunday-check-day').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusOfDay("sunday", true); } 
    else { changeStatusOfDay("sunday", false); }
});

$('#sunday-check-morning').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusMorning("sunday", true); } 
    else { changeStatusMorning("sunday", false); }
});

$('#sunday-check-afternoon').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAfternoon("sunday", true); } 
    else { changeStatusAfternoon("sunday", false); }
});

$('#sunday-check-allday').change(function() {
    // this will contain a reference to the checkbox   
    if (this.checked) { changeStatusAllDay("sunday", true); } 
    else { changeStatusAllDay("sunday", false); }
});
// END sunday






// funzioni di controllo 
function changeStatusOfDay(day, enable) {
    $("#"+day+"-check-morning").prop('disabled', !enable);
    $("#"+day+"-check-afternoon").prop('disabled', !enable);
    $("#"+day+"-check-allday").prop('disabled', !enable);
    $("#"+day+"-hour-morning-start").prop('disabled', !enable);
    $("#"+day+"-hour-morning-end").prop('disabled', !enable);
    $("#"+day+"-hour-afternoon-start").prop('disabled', !enable);
    $("#"+day+"-hour-afternoon-end").prop('disabled', !enable);
    $("#"+day+"-hour-allday-start").prop('disabled', true);
    $("#"+day+"-hour-allday-end").prop('disabled', true);

    
    $("#"+day+"-check-allday").prop('checked', false);

    $("#"+day+"-check-morning").prop('checked', enable);
    $("#"+day+"-check-afternoon").prop('checked', enable);
}

function disableAllDay(day, enable) {
    $("#"+day+"-check-morning").prop('disabled', !enable);
    $("#"+day+"-check-afternoon").prop('disabled', !enable);
    $("#"+day+"-check-allday").prop('disabled', !enable);
    $("#"+day+"-hour-morning-start").prop('disabled', !enable);
    $("#"+day+"-hour-morning-end").prop('disabled', !enable);
    $("#"+day+"-hour-afternoon-start").prop('disabled', !enable);
    $("#"+day+"-hour-afternoon-end").prop('disabled', !enable);
    $("#"+day+"-hour-allday-start").prop('disabled', !enable);
    $("#"+day+"-hour-allday-end").prop('disabled', !enable);
}

function disableAllDayInput(day, enable) {
    $("#"+day+"-hour-allday-start").prop('disabled', enable);
    $("#"+day+"-hour-allday-end").prop('disabled', enable);
}

function changeStatusMorning(day, enable) {
    $("#"+day+"-hour-morning-start").prop('disabled', !enable);
    $("#"+day+"-hour-morning-end").prop('disabled', !enable);
}

function changeStatusAfternoon(day, enable) {
    $("#"+day+"-hour-afternoon-start").prop('disabled', !enable);
    $("#"+day+"-hour-afternoon-end").prop('disabled', !enable);
}

function changeStatusAllDay(day, enable) {
    $("#"+day+"-hour-allday-start").prop('disabled', !enable);
    $("#"+day+"-hour-allday-end").prop('disabled', !enable);

    // disable also check
    $("#"+day+"-check-morning").prop('disabled', enable);
    $("#"+day+"-check-afternoon").prop('disabled', enable);

    $("#"+day+"-check-morning").prop('checked', !enable);
    $("#"+day+"-check-afternoon").prop('checked', !enable);

    changeStatusMorning(day, !enable);
    changeStatusAfternoon(day, !enable);
}

function takeAllOrari() {
    // stampino dell'oggetto info del giorno
    const dayInfo = {
        day: "",
        dayOpen: true,
        morning: true,
        morningStart: "",
        morningEnd: "",
        afternoon: true,
        afternoonStart: "",
        afternoonEnd: "",
        allDay: true,
        allDayStart: "",
        allDayEnd: "",
    }

    var daysInfo = [];
    for(var day of days) {
        let tempDay = {};
        tempDay.day = day;
        tempDay.dayOpen = $("#"+day+"-check-day").is(":checked");
        tempDay.morning = $("#"+day+"-check-morning").is(":checked");
        tempDay.afternoon = $("#"+day+"-check-afternoon").is(":checked");
        tempDay.allDay = $("#"+day+"-check-allday").is(":checked");
        tempDay.morningStart = $("#"+day+"-hour-morning-start").val();
        tempDay.morningEnd = $("#"+day+"-hour-morning-end").val();
        tempDay.afternoonStart = $("#"+day+"-hour-afternoon-start").val();
        tempDay.afternoonEnd = $("#"+day+"-hour-afternoon-end").val();
        tempDay.allDayStart = $("#"+day+"-hour-allday-start").val();
        tempDay.allDayEnd = $("#"+day+"-hour-allday-end").val();

        daysInfo.push(tempDay);
    }

    return daysInfo;
}

// funzione di controllo dei dati
function checkOrari(orari) {
    for(dayInfo of orari) {
        if( checkDay(dayInfo) == false ) {
            return false;
        }
    }
    return true;
}

function checkDay(day) {
    // valid parte true e se arriva false vuol dire che qualcuno la ha modificata!
    var valid = true;
    if(day.allDay == true) {
        if(day.morning || day.afternoon) { valid = false; }
        const allDayStart = setHoursAndMinutes(day.allDayStart);
        const allDayEnd = setHoursAndMinutes(day.allDayEnd);
        if (allDayStart >= allDayEnd) {
            valid = false; 
            $("#" + day.day + "-hour-allday-start").css("border", "2px solid red");
        }else {
            $("#" + day.day + "-hour-allday-start").css("border", "2px solid green");
        }
    } else {
        const morningStart = setHoursAndMinutes(day.morningStart);
        const morningEnd = setHoursAndMinutes(day.morningEnd);
        const afternoonStart = setHoursAndMinutes(day.afternoonStart);
        const afternoonEnd = setHoursAndMinutes(day.afternoonEnd);

        if(day.morning == true) {
            if (morningStart >= morningEnd) {
                valid = false;
                $("#" + day.day + "-hour-morning-start").css("border", "2px solid red");
            } else {
                $("#" + day.day + "-hour-morning-start").css("border", "2px solid green");
            }
        }

        if(day.afternoon == true) {
            if (afternoonStart >= afternoonEnd) {
                valid =  false;
                $("#" + day.day + "-hour-afternoon-start").css("border", "2px solid red");
            }else {
                $("#" + day.day + "-hour-afternoon-start").css("border", "2px solid green");
            }
        }

        if( day.morning == true && day.afternoon == true ) {
            if (morningEnd >= afternoonStart) {
                valid =  false;
                $("#" + day.day + "-hour-afternoon-start").css("border", "2px solid red");
            }
        }

    }

    // missione compiuta
    return valid;
}

function setHoursAndMinutes(timeString) {
    var date = new Date();
    var timeParts = timeString.split(':');
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);

    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}




// raccolta dei dati e controllo
$(document).ready(function() {

    // invio dati form orari
    $("#save-orari-button").click(function(){
        const orari = takeAllOrari();
        console.log(orari);

        if(checkOrari(orari)) {
            $('#salvataggio-result-text').css("color", "green");
            $('#salvataggio-result-text').text("Orari Corretti! Salvataggio in corso...");

            $.ajax({
                url: '/api/orari/update',
                type: 'POST',
                data: JSON.stringify(orari),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                async: false,
                success: function(msg) {
                    //console.log(msg);
                    $('#send-result-text').css("color", "green");
                    $('#send-result-text').text("Salvataggio Effettuato");
                },
                error: function(e) {
                    console.log(e);
                    $('#send-result-text').css("color", "red");
                    $('#send-result-text').text("Errore nel salvataggio!");
                }
            });

        } else {
            $('#salvataggio-result-text').css("color", "red");
            $('#salvataggio-result-text').text("Orari non corretti! Controlla qualcosa prima di salvare...");
        }
    }); 


    $("#enable-orari-button").click(function(){
        $.get( "/api/orari/enable", function( data ) {
            if(data.object.enable) {
                // funzione attiva
                $('#save-orari-button').prop('disabled', false);
                changeStatusForm(false);
                $('#enable-orari-button').html("Disattiva Orari");
            } else {
                // funzione disattiva
                $('#save-orari-button').prop('disabled', true);
                changeStatusForm(true);
                $('#enable-orari-button').html("Attiva Orari");
            }
        });
    });


});

