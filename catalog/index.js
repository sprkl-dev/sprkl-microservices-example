const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;

const { createClient } = require('redis');

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT ?? 6379;
const redisURL = `redis://${redisHost}:${redisPort}`
const client = createClient({url: redisURL});
client.on('error', (err) => console.log('Redis Client Error', err));

async function bootstrap() {
  await client.connect();
  // seed
  await client.set('1', JSON.stringify({name: 't-shirt', price: 300}));
  await client.set('2', JSON.stringify({name: 'jeans', price: 500}));
  await client.set('3', JSON.stringify({name: 'hat', price: 100}));
  app.listen(port, () => {
    console.log(`catalog server is listening on port ${port}`)
  })
}

async function getCatalog() {
  const keys = await client.keys('*');
  const catalog = [];
  for (const key of keys) {
    catalog.push({id: key, ...JSON.parse((await client.get(key)))});
  }
  return catalog;
}

app.get('/catalog', async (req, res) => {
  console.log('GET /catalog')
  res.send(await getCatalog());
})

bootstrap();
