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


async function bootstap() {
  try {
    await mongoClient.connect();
    ordersCollection = mongoClient.db('orders').collection('orders');
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)  
  }
}

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

fastify.post('/orders', async function (request, reply) {
  const { items } = request.body;
  const order = { id: crypto.randomUUID(), items: items, state: 'pre-validation' }
  if (!Array.isArray(items) || items.some(item => typeof item !== 'string')) {
    order.state = 'invalid'
    ordersCollection.insertOne(order);
    reply.send(order.state).code(400);
    return;
  }
  const totalPrice = await getTotalPrice(items)
  console.log(totalPrice)
  if (totalPrice < 0) {
    order.state = 'invalid'
    ordersCollection.insertOne(order);
    reply.send(order.state).code(400);
    return;
  }
  order.state = 'pre-payment'
  if (!(await pay({amount: totalPrice, orderId: order.id}))) {
    order.state = 'payment-failed'
    ordersCollection.insertOne(order);
    reply.send(order.state).code(400);
    return;
  }
  order.state = 'landed'
  ordersCollection.insertOne(order);
  reply.send(order.state).code(200);
})

fastify.get('/orders', async function (request, reply) {
  const orders = [];
  const cursor = await ordersCollection.find()
  await cursor.forEach((order) => orders.push(order))
  reply.send(orders).code(200);
})

bootstap()
