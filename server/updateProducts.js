const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const dairyProducts = [
    {
        name: 'Fresh Whole Milk',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Milk',
        description: 'Fresh whole milk from local farms. Rich in calcium and vitamins.',
        price: 65,
        countInStock: 50,
        rating: 4.5,
        numReviews: 12
    },
    {
        name: 'Greek Yogurt',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Yogurt',
        description: 'Creamy Greek yogurt packed with protein. Perfect for breakfast.',
        price: 120,
        countInStock: 30,
        rating: 4.8,
        numReviews: 25
    },
    {
        name: 'Cheddar Cheese Block',
        image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Cheese',
        description: 'Aged cheddar cheese with a rich, sharp flavor.',
        price: 250,
        countInStock: 20,
        rating: 4.7,
        numReviews: 18
    },
    {
        name: 'Fresh Butter',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Butter',
        description: 'Creamy, fresh butter made from pure cream.',
        price: 180,
        countInStock: 40,
        rating: 4.6,
        numReviews: 15
    },
    {
        name: 'Paneer (Cottage Cheese)',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Cheese',
        description: 'Fresh paneer, perfect for Indian cuisine.',
        price: 150,
        countInStock: 25,
        rating: 4.9,
        numReviews: 30
    },
    {
        name: 'Flavored Yogurt - Strawberry',
        image: 'https://images.unsplash.com/photo-1571212515416-fca2e53bfb7b?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Yogurt',
        description: 'Delicious strawberry flavored yogurt with real fruit.',
        price: 80,
        countInStock: 35,
        rating: 4.4,
        numReviews: 20
    },
    {
        name: 'Low Fat Milk',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Milk',
        description: 'Healthy low-fat milk with all the nutrients.',
        price: 60,
        countInStock: 45,
        rating: 4.3,
        numReviews: 10
    },
    {
        name: 'Mozzarella Cheese',
        image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&h=400&fit=crop',
        brand: 'Dairy Drop',
        category: 'Cheese',
        description: 'Fresh mozzarella cheese, perfect for pizzas and salads.',
        price: 220,
        countInStock: 15,
        rating: 4.7,
        numReviews: 22
    }
];

const updateProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Get the first admin user to assign as product owner
        const User = require('./models/User');
        const adminUser = await User.findOne({ isAdmin: true });

        if (!adminUser) {
            console.log('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        // Delete all existing products
        await Product.deleteMany({});
        console.log('Deleted all existing products');

        // Add user reference to each product
        const productsWithUser = dairyProducts.map(product => ({
            ...product,
            user: adminUser._id
        }));

        // Insert new products
        const createdProducts = await Product.insertMany(productsWithUser);
        console.log(`Created ${createdProducts.length} products successfully!`);

        createdProducts.forEach(product => {
            console.log(`- ${product.name} (₹${product.price})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error updating products:', error);
        process.exit(1);
    }
};

updateProducts();
