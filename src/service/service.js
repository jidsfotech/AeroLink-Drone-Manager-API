const fs = require('fs');
const path = require('path');
const pathToDronesData = path.join(__dirname, '../data/drones.js');
const pathToDroneLoadedItems = path.join(__dirname, '../data/drones-medication-loads.js');

class DroneMsService {

    /**
     * Register a drone service
     * @param {Object} drone 
     */
    async registerDrone(drone) {
        return new Promise((resolve, reject) => {
            try {
                // get drones, add the new drone data and update the in-memory file
                let drones = fs.readFileSync(pathToDronesData).toString('utf8');
                drones = JSON.parse(drones);
                drone.id = drones.length + 1;
                // initilise the drone loaded weight to 0
                drone.loadedWeight = 0;
                drones.push(drone);
                fs.writeFileSync(pathToDronesData, JSON.stringify(drones));
                return resolve(drone)
            } catch (E) {
                return reject(E)
            }
        });
    }

    /**
     * load a drone with medication service
     * @param {Object} medication 
     * @param {Object} droneId 
     */
    async loadDrone(droneId, medication) {
        return new Promise((resolve, reject) => {
            try {
                // get all drones
                let drones = fs.readFileSync(pathToDronesData).toString('utf8');
                drones = JSON.parse(drones);

                // Find the drone by ID
                const drone = drones.find((drone) => drone.id === Number(droneId));

                if (!drone) {
                    return reject({ message: 'Drone not found' });
                }

                if (!['IDLE', 'LOADING'].includes(drone.state)) {
                    return reject({ message: 'Drone is not in IDLE or LOADING state' });
                }

                // Prevent the drone from being loaded with more weight that it can carry;
                let medicationWeight = medication.weight;
                // remove currently loaded items-weight from the drone weight-limit to get the available space
                let availableDroneWeight = drone.weightLimit - drone.loadedWeight;
                if (medicationWeight > drone.weightLimit || medicationWeight > availableDroneWeight ) {
                    return reject({ message: `medication weight exceeds the drone weight limit or bigger than available space: ${availableDroneWeight}` });
                }

                // Prevent the drone from being in LOADING state if the battery level is **below 25%**;
                if (drone.batteryCapacity < 25) {
                    return reject({ message: `Drone battery capacity is below 25%` });
                }

                // set drone state to 'LOADED'
                drone.state = 'LOADING'
                // add the medication weight to the currently loaded weight to get overall loaded weight
                drone.loadedWeight = medicationWeight + availableDroneWeight;
                const indexOfDroneToUpdate = drones.findIndex(obj => obj.id === droneId);
                if (indexOfDroneToUpdate == -1) {
                    drones[indexOfDroneToUpdate] = drone;
                    fs.writeFileSync(pathToDronesData, JSON.stringify(drones));
                }

                // create a log for the loaded drone
                let dronesLoad = fs.readFileSync(pathToDroneLoadedItems).toString('utf8');
                dronesLoad = JSON.parse(dronesLoad);
                const load = {
                    id: dronesLoad.length + 1,
                    droneId: droneId,
                    medicationItems: medication,
                    date: new Date().toDateString()
                }
                dronesLoad.push(load)
                fs.writeFileSync(pathToDroneLoadedItems, JSON.stringify(dronesLoad))
                return resolve(load);
            } catch (E) {
                return reject(E)
            }
        });
    }

};

module.exports = DroneMsService;