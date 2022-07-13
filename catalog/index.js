const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;

const { createClient } = require('redis');
const { promisify } = require('util');

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT ?? 6379;
const redisURL = `redis://${redisHost}:${redisPort}`
const client = createClient({url: redisURL});
client.on('error', (err) => console.log('Redis Client Error', err));
const clientSet = promisify(client.set).bind(client);
const clientGet = promisify(client.get).bind(client);
const clientKeys = promisify(client.keys).bind(client);

async function bootstrap() {
  // seed
  await clientSet('1', JSON.stringify({name: 't-shirt', price: 300}));
  await clientSet('2', JSON.stringify({name: 'jeans', price: 500}));
  await clientSet('3', JSON.stringify({name: 'hat', price: 100}));
  app.listen(port, () => {
    console.log(`catalog server is listening on port ${port}`)
  })
}

async function getCatalog() {
  const keys = await clientKeys('*');
  const catalog = [];
  for (const key of keys) {
    catalog.push({id: key, ...JSON.parse((await clientGet(key)))});
  }
  return catalog;
}

app.get('/catalog', async (req, res) => {
  console.log('GET /catalog')
  res.send(await getCatalog());
})

bootstrap();
