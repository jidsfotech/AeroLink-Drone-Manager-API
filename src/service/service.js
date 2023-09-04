const fs = require('fs');
const path = require('path');

class DroneMsService {

    /**
     * Register a drone service
     * @param {Object} drone 
     */
    async registerDrone(drone) {
        return new Promise((resolve, reject) => {
            try {
                const inMemoryFilePath = path.join(__dirname, '../data/data.js');
                // get drones, add the new drone data and update the in-memory file
                let drones = fs.readFileSync(inMemoryFilePath).toString('utf8');
                drones = JSON.parse(drones);
                drones.push(drone);
                fs.writeFileSync(inMemoryFilePath, JSON.stringify(drones));
                return resolve(drone)
            } catch (E) {
                return reject(E)
            }
        });
    }

};

module.exports = DroneMsService;