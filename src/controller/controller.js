
class DroneMsController {
    constructor(DroneService) {
        this.droneMsService = DroneService;
    }

    /**
     * Register a drone controller
     * @param {*} req 
     * @param {*} res 
     */
    async registerDrone(req, res) {
        const drone = req.body;
        return await this.droneMsService.registerDrone(drone)
            .then((resp) => {
                console.log('Drone registered successfully', resp)
                return res.status(200)
                    .json({
                        message: 'Drone registered successfully',
                        data: resp
                    })
            })
            .catch((E) => {
                console.log('Error occured while registering a drone', E);
                return res.status(400)
                    .json({
                        message: 'Error occured while registering a drone',
                        error: E
                    });
            })
    }

    /**
     * Load a drone with medication controller
     * @param {*} req 
     * @param {*} res 
     */
    async loadDrone(req, res) {
        const medication = req.body;
        const { droneId } = req.params;
        return await this.droneMsService.loadDrone(droneId, medication)
            .then((resp) => {
                return res.status(200)
                    .json({
                        message: 'Drone loaded successfully',
                        data: resp
                    })
            })
            .catch((E) => {
                console.log('Error occured while loading a drone', E);
                return res.status(400)
                    .json({
                        message: 'Error occured while loading a drone',
                        error: E
                    });
            })
    }

    /**
     * Get loaded medication items for a given drone controller
     * @param {*} req 
     * @param {*} res 
     */
    async getDroneLoads(req, res) {
        const { droneId } = req.params;
        return await this.droneMsService.getDroneLoads(droneId)
            .then((resp) => {
                return res.status(200)
                    .json({
                        message: 'Drone medical items fetched successfully',
                        data: resp
                    })
            })
            .catch((E) => {
                console.log('Error occured while fetching drone medical items', E);
                return res.status(400)
                    .json({
                        message: 'Error occured while fetching drone medical items',
                        error: E
                    });
            })
    }

    /**
     * Get available drones controller
     * @param {*} req 
     * @param {*} res 
     */
    async getAvaialiableDrones(req, res) {
        return await this.droneMsService.getAvaialiableDrones()
            .then((resp) => {
                return res.status(200)
                    .json({
                        message: 'Avaialble drones fetched successfully',
                        data: resp
                    })
            })
            .catch((E) => {
                console.log('Error occured while fetching avaialable drones', E);
                return res.status(400)
                    .json({
                        message: 'Error occured while fetching avaialable drones',
                        error: E
                    });
            })
    }

    /**
     * Get a drone battery level controller
     * @param {*} req 
     * @param {*} res 
     */
    async getDroneBatteryLevel(req, res) {
        const { droneId } = req.params;
        return await this.droneMsService.getDroneBatteryLevel(droneId)
            .then((resp) => {
                return res.status(200)
                    .json({
                        message: 'Drone battery level retrieved successfully',
                        data: resp
                    })
            })
            .catch((E) => {
                console.log('Error occured while retrieving drone battery level', E);
                return res.status(400)
                    .json({
                        message: 'Error occured while retrieving drone battery level',
                        error: E
                    });
            })
    }
}

module.exports = DroneMsController;