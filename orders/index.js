const fastify = require('fastify')({ logger: { level: 'trace' } })
const crypto = require('crypto')
const {MongoClient} = require('mongodb');

const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT ?? 27017
const mongoClient = new MongoClient(`mongodb://${mongoHost}:${mongoPort}/orders`)
let ordersCollection;

const paymentsURL = process.env.PAYMENTS_URL


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

fastify.post('/orders', async function (request, reply) {
  const { items } = request.body;
  const order = { id: crypto.randomUUID(), items: items, state: 'pre-validation' }
  if (!Array.isArray(items) || items.some(item => typeof item !== 'string')) {
    order.state = 'invalid'
    ordersCollection.insertOne(order);
    reply.send(order.state).code(400);
    return;
  }
  order.state = 'pre-payment'
  // TODO: get prices
  try {
    await fetch(`${paymentsURL}/`, {method: 'POST', body: { amount: items.length, orderId: order.id }})
  } catch(e) {
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
