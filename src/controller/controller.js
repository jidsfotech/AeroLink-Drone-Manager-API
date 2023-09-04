
class DroneMsController {
    constructor(DroneService) {
        this.droneMsService = DroneService;
    }

    /**
     * Register a drone controller
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async registerDrone(req, res, next) {
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
}

module.exports = DroneMsController;