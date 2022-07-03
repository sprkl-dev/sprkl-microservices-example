const express = require('express');
const app = express();
const port = process.env.PORT ?? 3000;

const catalog = [
  {
    id: '1',
    name: 't-shirt',
    price: 300,
  },
]

app.get('/catalog', (req, res) => {
  console.log('GET /catalog')
  res.send(catalog);
})

app.listen(port, () => {
  console.log(`catalog server is listening on port ${port}`)
})
