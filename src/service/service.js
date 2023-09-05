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
                let drones = fs.readFileSync(pathToDronesData).toString('utf8');
                drones = JSON.parse(drones);
                drone.id = drones.length + 1;

                // This field will be used to keep track of the current weight of the loaded medication items 
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
     * load a drone with medication items service
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
                const medicationWeight = medication.weight;
                const loadWeightAddable = drone.weightLimit - drone.loadedWeight;
                if (medicationWeight > drone.weightLimit || medicationWeight > loadWeightAddable) {
                    return reject({ message: `medication weight must not exceed the drone weight-limit, available-space: ${loadWeightAddable}kg` });
                }

                // Prevent the drone from being in LOADING state if the battery level is **below 25%**;
                if (drone.batteryCapacity < 25) {
                    return reject({ message: `Drone battery capacity is below 25%` });
                }

                // update the drone loadedWeight property to keep track of current load-weight.
                if (drone.loadedWeight === 0) {
                    drone.loadedWeight = medicationWeight
                } else {
                    drone.loadedWeight = drone.loadedWeight + medicationWeight;
                }

                // set drone state to 'LOADED' if the weight of the load it currently carries equals the drone weight-limit
                if (drone.loadedWeight === drone.weightLimit) {
                    drone.state = 'LOaded';
                } else {
                    drone.state = 'LOADING';
                }

                const indexOfDroneToUpdate = drones.findIndex(obj => obj.id === droneId);
                if (indexOfDroneToUpdate == -1) {
                    drones[indexOfDroneToUpdate] = drone;
                    fs.writeFileSync(pathToDronesData, JSON.stringify(drones));
                }

                // create a log for each medication items loaded on the drone
                let dronesLoad = fs.readFileSync(pathToDroneLoadedItems).toString('utf8');
                dronesLoad = JSON.parse(dronesLoad);
                const medicationItem = {
                    id: dronesLoad.length + 1,
                    droneId: droneId,
                    medicationItems: medication,
                    date: new Date().toDateString()
                }
                dronesLoad.push(medicationItem)
                fs.writeFileSync(pathToDroneLoadedItems, JSON.stringify(dronesLoad))
                return resolve(load);
            } catch (E) {
                return reject(E)
            }
        });
    }

    /**
     * Get loaded medication items for a given drone service
     * @param {Object} droneId 
     */
    async getDroneLoads(droneId) {
        return new Promise((resolve, reject) => {
            try {
                let dronesLoads = fs.readFileSync(pathToDroneLoadedItems).toString('utf8');
                dronesLoads = JSON.parse(dronesLoads);
                return resolve(dronesLoads.filter(load => load.droneId === droneId));
            } catch (E) {
                return reject(E)
            }
        });
    }
};

module.exports = DroneMsService;