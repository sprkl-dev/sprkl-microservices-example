const fastify = require('fastify')({ logger: { level: 'trace' } })
const crypto = require('crypto')
const {MongoClient} = require('mongodb');
const {default: axios} = require('axios');

const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT ?? 27017
const mongoClient = new MongoClient(`mongodb://${mongoHost}:${mongoPort}/orders`)
let ordersCollection;

const paymentsURL = process.env.PAYMENTS_URL
const catalogURL = process.env.CATALOG_URL

async function pay({amount, orderId}) {
    console.log({amount, orderId})
    try {
        await axios.post(`${paymentsURL}/payments`, { amount, orderId })
        return true
    } catch(e) {
        fastify.log.error(e)
        return false
    }
}

async function getTotalPrice(itemNames) {
    try {
        const catalog = await (await axios.get(`${catalogURL}/catalog`)).data
        console.log(catalog);
        const itemPriceByName = new Map();
        const itemPriceById = new Map();
        for (const item of catalog) {
            itemPriceByName.set(item.name, item.price)
            itemPriceById.set(item.id, item.price)
        }
        let totalPrice = 0;
        for (const item of itemNames) {
            if (itemPriceByName.has(item)) {
                totalPrice += itemPriceByName.get(item)
            } else if (itemPriceById.has(item)){
                totalPrice += itemPriceById.get(item)
            } else {
                fastify.log.error({item: item, msg: 'failed to find an item'})
                return -1;
            }
        }
        return totalPrice
    } catch(e) {
        fastify.log.error(e)
        return -1;
    }
}

module.exports = {
    pay, getTotalPrice
}