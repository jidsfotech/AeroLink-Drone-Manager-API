const path = require('path');
const fs = require('fs');

const pathToDronesData = path.join(__dirname, '../data/drones.js');
const pathToDronesBatteryLevelLogs = path.join(__dirname, '../data/drone-battery-level-logs.js');

const checkDroneBatteryLevel = () => {
    try {
        let drones = fs.readFileSync(pathToDronesData).toString('utf8');
        let droneBatteryLogs = fs.readFileSync(pathToDronesBatteryLevelLogs).toString('utf8');
        drones = JSON.parse(drones);
        droneBatteryLogs = JSON.parse(droneBatteryLogs);
        for (let drone of drones) {
            const droneBatteryState = {
                droneId: drone.id,
                batteryLevel: drone.batteryCapacity,
                createdAt: new Date()
            }
            droneBatteryLogs.push(droneBatteryState);
        }
        console.table(droneBatteryLogs)
        fs.writeFileSync(pathToDronesBatteryLevelLogs, JSON.stringify(droneBatteryLogs));
    } catch (E) {
        throw E
    }
}

// Run at 30 second interval
module.exports = setInterval(checkDroneBatteryLevel, 30000)