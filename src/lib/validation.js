const { droneModel, droneState } = require('../lib/constants');

const validateDrone = (req, res, next) => {
    const drone = req.body

    if (!drone.serialNumber || typeof drone.serialNumber !== 'string' || drone.serialNumber.length > 100) {
        return res.status(400).json({error:'Serial number must be a string with a maximum length of 100 characters.'});
    }

    if (!droneModel.includes(drone.model)) {
        return res.status(400).json({error:'Invalid drone model.'});
    }

    if (typeof drone.weightLimit !== 'number' || drone.weightLimit <= 0 || drone.weightLimit > 500) {
        return res.json({error:'Weight limit must be a number between 0 and 500.'});
    }

    if (typeof drone.batteryCapacity !== 'number' || drone.batteryCapacity < 0 || drone.batteryCapacity > 100) {
        return res.json({error:'Battery capacity must be a number between 0 and 100.'});
    }

    if (!droneState.includes(drone.state)) {
        return res.json({error:'Invalid drone state.'});
    }

    next();
}

module.exports = { validateDrone };
