var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


/*
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
*/


function checkOrari(orariObj) {
    var nDay = 0;
    try {
        for(orariSingle of orariObj) {
            // controllo nome corretto
            if(orariSingle.day != days[nDay]) { return false; }
            nDay++;
            if(checkDay(orariSingle) == false) { return false; }
            // controllo validità orari
        }
    } catch(e) {
        return false;
    }
    
    // missione compiuta
    return true;
}


function checkDay(day) {
    // valid parte true e se arriva false vuol dire che qualcuno la ha modificata!
    var valid = true;

    try {
        if(day.allDay == true) {
            if(day.morning || day.afternoon) { valid = false; }
            const allDayStart = setHoursAndMinutes(day.allDayStart);
            const allDayEnd = setHoursAndMinutes(day.allDayEnd);
            if (allDayStart >= allDayEnd) {
                valid = false;
            }
        } else {
            const morningStart = setHoursAndMinutes(day.morningStart);
            const morningEnd = setHoursAndMinutes(day.morningEnd);
            const afternoonStart = setHoursAndMinutes(day.afternoonStart);
            const afternoonEnd = setHoursAndMinutes(day.afternoonEnd);

            if(day.morning == true) {
                if (morningStart >= morningEnd) {
                    valid = false;
                }
            }
            if(day.afternoon == true) {
                if (afternoonStart >= afternoonEnd) {
                    valid =  false;
                }
            }

            if( day.morning == true && day.afternoon == true ) {
                if (morningEnd >= afternoonStart) {
                    valid =  false;
                }
            }
        }
    } catch(e) {
        valid = false;
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



module.exports = {checkOrari}