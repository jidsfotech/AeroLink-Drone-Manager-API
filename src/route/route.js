const express = require('express');
const routes = express.Router();
const DroneMsService = require('../service/service');
const DroneMsController = require('../controller/controller');
const { validateDrone } = require('../lib/validation');

const droneMsService = new DroneMsService();
const droneMsController = new DroneMsController(droneMsService);

// Register a drone
routes.post(
    '/drones',
    (req, res, next) => validateDrone(req, res, next),
    (req, res, next) => droneMsController.registerDrone(req, res, next)
);

module.exports = routes;