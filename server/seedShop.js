const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShopItem = require('./models/ShopItem');
const Sale = require('./models/Sale');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const shopItems = [
    // Packed Snacks
    { itemName: 'Parle-G Gold (250g)', price: 30, quantity: 100, threshold: 20, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },
    { itemName: 'Oreo Vanilla (120g)', price: 40, quantity: 50, threshold: 15, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },
    { itemName: 'Britannia Bourbon (150g)', price: 35, quantity: 60, threshold: 15, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },
    { itemName: 'Kurkure Masala Munch', price: 20, quantity: 80, threshold: 25, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },
    { itemName: 'Bingo Tedhe Medhe', price: 20, quantity: 70, threshold: 20, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },
    { itemName: 'Haldiram Alooo Bhujia (200g)', price: 50, quantity: 45, threshold: 10, category: 'Packed Snacks', isVeg: true, isIndianBrand: true },

    // Ready-to-Eat
    { itemName: 'Veg Maggi (Single)', price: 15, quantity: 200, threshold: 50, category: 'Ready-to-Eat', isVeg: true, isIndianBrand: true },
    { itemName: 'Indori Poha Cup', price: 45, quantity: 40, threshold: 10, category: 'Ready-to-Eat', isVeg: true, isIndianBrand: true },
    { itemName: 'Veg Biryani (MTR)', price: 120, quantity: 20, threshold: 5, category: 'Ready-to-Eat', isVeg: true, isIndianBrand: true },

    // Ice Creams
    { itemName: 'Amul Chocobar', price: 30, quantity: 40, threshold: 10, category: 'Ice Creams', isVeg: true, isIndianBrand: true },
    { itemName: 'Havmor Rajbhog Cup', price: 50, quantity: 25, threshold: 8, category: 'Ice Creams', isVeg: true, isIndianBrand: true },

    // Beverages
    { itemName: 'Owl Coffee Sachet', price: 10, quantity: 150, threshold: 30, category: 'Beverages', isVeg: true, isIndianBrand: true },
    { itemName: 'Packaged Water (1L)', price: 20, quantity: 120, threshold: 40, category: 'Beverages', isVeg: true, isIndianBrand: true },

    // Dairy
    { itemName: 'Verka Toned Milk (500ml)', price: 28, quantity: 30, threshold: 10, category: 'Dairy Products', isVeg: true, isIndianBrand: true },
    { itemName: 'Verka Fresh Paneer (200g)', price: 90, quantity: 15, threshold: 5, category: 'Dairy Products', isVeg: true, isIndianBrand: true },

    // Essentials
    { itemName: 'Dettol Handwash', price: 99, quantity: 25, threshold: 5, category: 'Daily-Use Essentials', isVeg: true, isIndianBrand: true },
    { itemName: 'Cotton Hand Towel', price: 150, quantity: 20, threshold: 5, category: 'Daily-Use Essentials', isVeg: true, isIndianBrand: true },

    // Stationery
    { itemName: 'Parker Beta Pen', price: 50, quantity: 30, threshold: 10, category: 'Stationery', isVeg: true, isIndianBrand: true },
    { itemName: 'Classmate Notebook', price: 60, quantity: 40, threshold: 10, category: 'Stationery', isVeg: true, isIndianBrand: true },

    // Chocolates
    { itemName: 'Dairy Milk Silk', price: 80, quantity: 35, threshold: 10, category: 'Chocolates', isVeg: true, isIndianBrand: true }
];

const seedShop = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas...');

        await ShopItem.deleteMany({});
        await Sale.deleteMany({});
        console.log('Cleared existing shop data...');

        const createdItems = await ShopItem.insertMany(shopItems);
        console.log(`Successfully seeded ${createdItems.length} shop items.`);

        // Add some dummy sales for movement insights
        const dummySales = [
            { item: createdItems[0]._id, itemName: createdItems[0].itemName, category: createdItems[0].category, quantity: 12, totalAmount: 12 * createdItems[0].price, soldBy: 'Vinay Kumar' },
            { item: createdItems[3]._id, itemName: createdItems[3].itemName, category: createdItems[3].category, quantity: 25, totalAmount: 25 * createdItems[3].price, soldBy: 'Adel Muhmaad' },
            { item: createdItems[6]._id, itemName: createdItems[6].itemName, category: createdItems[6].category, quantity: 40, totalAmount: 40 * createdItems[6].price, soldBy: 'Vinay Kumar' }
        ];
        await Sale.insertMany(dummySales);
        console.log('Seeded dummy sales for analytics...');

        process.exit();
    } catch (error) {
        console.error('Error seeding shop:', error);
        process.exit(1);
    }
};

seedShop();
