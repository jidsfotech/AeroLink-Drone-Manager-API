const { droneModel, droneState } = require('../lib/constants');

const validateDrone = (req, res, next) => {
    const drone = req.body

    if (!drone.serialNumber || typeof drone.serialNumber !== 'string' || drone.serialNumber.length > 100) {
        return res.status(400).json({ error: 'Serial number must be a string with a maximum length of 100 characters.' });
    }

    if (!droneModel.includes(drone.model)) {
        return res.status(400).json({ error: 'Invalid drone model.' });
    }

    if (typeof drone.weightLimit !== 'number' || drone.weightLimit <= 0 || drone.weightLimit > 500) {
        return res.json({ error: 'Weight limit must be a number between 0 and 500.' });
    }

    if (typeof drone.batteryCapacity !== 'number' || drone.batteryCapacity < 0 || drone.batteryCapacity > 100) {
        return res.json({ error: 'Battery capacity must be a number between 0 and 100.' });
    }

    if (!droneState.includes(drone.state)) {
        return res.json({ error: 'Invalid drone state.' });
    }

    next();
}

const validateDroneLoad = (req, res, next) => {
    const medication = req.body;
    const upload = req.files;
    const validateImage = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!medication.name || typeof medication.name !== 'string') {
        return res.status(400).json({ error: 'Medication name must be a non-empty string.' });
    }

    if (!/^[a-zA-Z0-9\-_]+$/.test(medication.name)) {
        return res.status(400)
            .json({ error: 'Medication name must consist of letters, numbers, iphene, and underscores only.' });
    }

    if (typeof medication.weight !== 'number' || medication.weight <= 0) {
        return res.status(400).json({ error: 'Medication weight must be a positive number.' });
    }

    if (!medication.code || typeof medication.code !== 'string') {
        return res.status(400).json({ error: 'Medication code must be a non-empty string.' });
    }

    if (!/^[A-Z0-9_]+$/.test(medication.code)) {
        return res.status(400)
            .json({ error: 'Medication code must consist of uppercase letters, numbers, and underscores only.' });
    }

    if (upload && !validateImage.exec(path.extname(upload.image.name))) {
        return res.status(400).json({ error: 'medication image must be of type jpg, png, jpeg, and gif' });
    }

    next();
}
module.exports = { validateDrone, validateDroneLoad };
