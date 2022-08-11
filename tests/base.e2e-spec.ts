const axios = require('axios');

const ORDERS_URL = "http://localhost:80/api/orders/orders"
const CATALOG_URL = "http://localhost:80/api/catalog/catalog"
const PAYMENTS_URL = "http://localhost:80/api/payments/payments"

async function checkAlive(url) {
  try {
    const res = await axios.get(url, { timeout: 100});
    if (res.status == 200) {
      return true
    }
  } catch(ex) { 
    return false;
  }

  return false;
}

async function waitForAlive(url) {
  for (let i=0; i < 200; i++) {
    if (await checkAlive(url)) {
      return true;
    } else {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return false;
}

beforeAll(async () => {
  for (const url of [ORDERS_URL, CATALOG_URL, PAYMENTS_URL]) {
    if (await waitForAlive(url) == false) {
      throw new Error(`${url} didn't start in time`)
    }
  }
}, 50000)


let config = {
  headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json',
    Authorization: null 
  }
}

const userDetails = {
  name: "Erez",
  email: "erez@sprkl.dev",
  password: "1234",
  _id: null
}

const order = {
  items : [
    't-shirt'
  ]
}

test('PlaceOrder', async () => {
  const res = await axios.post(ORDERS_URL, order, config);
  expect(res.status).toBe(200)
})


test('GetOrders', async () => {
  const res = await axios.post(ORDERS_URL, order, config);
  expect(res.status).toBe(200)
})


// test('RegisterUser', async () => {
//   const res = await axios.post('http://localhost:8080/api/users/register', userDetails, config )
//   userDetails.token = res.data.token;
// })

// test('Signin', async () => {
//   const res = await axios.post('http://localhost:8080/api/users/signin', userDetails, config )
  
//   config.headers.Authorization = `Bearer ${res.data.token}`
//   userDetails._id = res.data._id
// })

// test('TestMine', async () => {
//   //console.log("EDEBUG using token" + config.headers.Authorization)
//   const res = await axios.get('http://localhost:8080/api/orders/mine', config)
// })

// test('TestPaypal', async () => {
//   const res = await axios.get('http://localhost:8080/api/products')
//   const products = res.data;
// })

// test('TestMastercard', async () => {
//   const res = await axios.get('http://localhost:8080/api/products')
//   const products = res.data;
// })

// test('TestMetrics', async () => {
//   const res = await axios.get('http://localhost:8080/api/products')
//   const products = res.data;
// })

// test('GetUsers', async () => {
//   const res = await axios.get('http://localhost:8080/api/products')
//   const products = res.data;
// })
