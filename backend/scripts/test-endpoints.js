const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testEndpoints() {
    console.log('🧪 Starting API Tests...');

    try {
        // 1. Test Products (Public)
        console.log('\nFetching Products...');
        const products = await axios.get(`${API_URL}/products`);
        console.log(`✅ Products: ${products.status} OK - Found ${products.data.length} items`);

        // 2. Test Auth (Signup)
        const testUser = {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            phone: '1234567890'
        };
        console.log(`\nRegistering User: ${testUser.email}...`);
        const signup = await axios.post(`${API_URL}/auth/signup`, testUser);
        console.log(`✅ Signup: ${signup.status} OK - Token received`);
        const token = signup.data.token;

        // 3. Test Protected Route (Profile)
        console.log('\nFetching Profile...');
        const profile = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Profile: ${profile.status} OK - User: ${profile.data.name}`);

        // 4. Create Order
        console.log('\nCreating Order...');
        const order = await axios.post(`${API_URL}/orders`, {
            orderItems: [
                {
                    name: 'Broiler Chicken',
                    qty: 1,
                    image: 'test.jpg',
                    price: 240,
                    cutType: 'curry',
                    unit: 'kg',
                    product: '000000000000000000000000' // Mock ID
                }
            ],
            shippingAddress: {
                address: 'Test Addr', city: 'Test City', postalCode: '123456', country: 'India'
            },
            pickupDetails: {
                name: 'Test Pickup', phone: '9876543210', date: '2024-01-01', time: 'Morning'
            },
            paymentMethod: 'Cash',
            itemsPrice: 240,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: 240
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`✅ Order Created: ${order.status} OK - ID: ${order.data._id}`);

        console.log('\n🎉 All Tests Passed!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error.response ? error.response.data : error.message);
    }
}

testEndpoints();
