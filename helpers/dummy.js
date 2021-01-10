function test(shop, email) {
    console.log('Shop Before: ', shop);
    console.log('email Before: ', email);
    typeof shop === 'undefined' ? (shop = null) : shop;
    typeof email === 'undefined' ? (email = null) : shop;
    console.log('\nShop After: ', shop);
    console.log('email After: ', email);
}

test('myShop');
