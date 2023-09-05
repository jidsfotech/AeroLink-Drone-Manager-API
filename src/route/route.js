const express = require('express');
const routes = express.Router();
const DroneMsService = require('../service/service');
const DroneMsController = require('../controller/controller');
const {
     validateDrone,
     validateDroneLoad
     } = require('../lib/validation');

const droneMsService = new DroneMsService();
const droneMsController = new DroneMsController(droneMsService);

// Register a drone route
routes.post(
    '/drones',
    (req, res, next) => validateDrone(req, res, next),
    (req, res) => droneMsController.registerDrone(req, res)
);

// load a drone with medication route
routes.post(
    '/drones/:droneId/load',
    (req, res, next) => validateDroneLoad(req, res, next),
    (req, res) => droneMsController.loadDrone(req, res)
);

// Get loaded medication items for a given drone route;
routes.get(
    '/drones/:droneId/loads',
    (req, res) => droneMsController.getDroneLoads(req, res)
);

// Get available drones route;
routes.get(
    '/available-drones',
    (req, res) => droneMsController.getAvaialiableDrones(req, res)
);

module.exports = routes;