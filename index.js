const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const routes = require('./src/route/route');
const fileupload = require('express-fileupload');
const checkDroneBatteryLevel = require('./src/scripts/check-drone-battery-level');

app.use(express.json());
app.use(
    fileupload({
        createParentPath: true,
        tempFileDir: '/tmp/'
    }),
);
app.use(routes);

//Run a periodic task to check drones battery levels and create history/audit event log for this.
checkDroneBatteryLevel;

app.get('/', (req, res, next) => {
    return res.status(200).json({
        status: 'Drone service is up and running',
        code: 200
    });
})


process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', { reason, ex: promise });
});

// Return a global message for any unregistered routes
app.all('*', function (req, res, next) {
    return res.status(400).json({
        status: 'resource not found',
        code: 400
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
