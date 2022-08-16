import Metrics from "../metrics/models/metric";

const axios = require('axios');

const BASE_URL = "http://localhost:80/api"
const ORDERS_URL = `${BASE_URL}/orders/orders`

async function checkAlive(url) {
  try {
    const res = await axios.get(`${url}`, { timeout: 100});
    if (res.status == 200) {
      return true
    }
  } catch(ex) { 
    return false;
  }

  return false;
}

async function waitForAlive(svc) {
  const healtzUrl = `${BASE_URL}/${svc}/healthz`
  for (let i=0; i < 200; i++) {
    if (await checkAlive(healtzUrl)) {
      return true;
    } else {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return false;
}

beforeAll(async () => {
  for (const svc of ['orders', 'catalog', 'metrics', 'payments']) {
    if (await waitForAlive(svc) == false) {
      throw new Error(`${svc} didn't start in time`)
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
  const res = await axios.get(ORDERS_URL, order);
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
