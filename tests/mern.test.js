const axios = require('axios');

const ORDERS_URL = "http://localhost:3000"

beforeAll(async () => {
  // console.log("Polling server at 8080")
  for (let i=0; i < 10; i++) {
    // console.log("Polling server at 8080")
    try {
      await axios.get(ORDERS_URL + '/healthz')
      console.log("Backend ready")
      return ; 
    } catch(ex) {
      if (ex.response && ex.response.status == 200) { 
        console.log("Backend ready")
        return ;
      }
      console.log("Sleeping ")
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}, 20000)


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
  const res = await axios.post(ORDERS_URL + '/orders', order, config)
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
