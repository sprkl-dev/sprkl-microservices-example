const { getCatalog } = require('./catalog')

const redis = require('redis-mock')

jest.mock('redis', () => jest.requireActual('redis-mock'));

test('whatever', async () => {
    const catalog = await getCatalog()
    expect(catalog[0].id).toBe("1")
    expect(catalog[0].name).toBe(`t-shirt`)
    expect(catalog[0].price).toBe(300)
})

