const { default: axios } = require("axios");

app.put('/updateMetrics', async (req, res) => {
    try {
        const metrics = await utils.retrieveMetrics();
        if (new Date().getDay() == 7) {
            metrics.saturdaysCounter++;
        } else {
            metrics.totalCounter++;
        }
        await utils.updateMetrics(metrics);
        res.sendStatus(200);
    } catch(ex) {
        res.status(401).send({ message: 'Failed updating metrics' + ex});
    }
});

const json = {
    totalCounter: metrics.totalCounter,
    saturdaysCounter: metrics.saturdaysCounter
}



async function updateMetrics() {
    try {
        await axios.put('http://localhost:7777/updateMetrics')
    } catch(ex) {
        console.log("Failed updating metrics")
    }
}
