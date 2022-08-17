jest.mock('axios')
const axios = require('axios')

const {pay} = require('./orders')
test('should make pay', async () => {
    axios.post.mockResolvedValue({data: []})

    const paid = await pay({amount: "totalPrice", orderId: "whatever"})
    expect(paid).toBe(true)
})