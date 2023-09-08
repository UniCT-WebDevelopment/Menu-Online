const mongoose = require('mongoose');

const orariSchema = mongoose.Schema({
    enable: {
        // indica se il prenotatore è attivo oppure no
        type: Boolean,
        required: true,
        default: false,
    },
    orariObjString: {
        type: String,
        required: true,
        default: '[{"day":"monday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"tuesday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"wednesday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"thursday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"friday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"saturday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"},{"day":"sunday","dayOpen":true,"morning":true,"afternoon":true,"allDay":false,"morningStart":"08:30","morningEnd":"13:00","afternoonStart":"13:30","afternoonEnd":"16:30","allDayStart":"13:30","allDayEnd":"16:30"}]',
        max: 2500,
    },
    user_id: {
        // collegamento con l'user_id dell'utente a cui appartiene
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null,
    },
    menu_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true,
    },
}, {timestamps: true});

const Orari = mongoose.model('Orari', orariSchema, 'Orari');
module.exports = Orari;