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

// Register a drone
routes.post(
    '/drones',
    (req, res, next) => validateDrone(req, res, next),
    (req, res, next) => droneMsController.registerDrone(req, res, next)
);

// load a drone with medication
routes.post(
    '/drones/:droneId/load',
    (req, res, next) => validateDroneLoad(req, res, next),
    (req, res, next) => droneMsController.loadDrone(req, res, next)
);

module.exports = routes;