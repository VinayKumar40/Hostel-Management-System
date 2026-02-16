try {
    console.log('Requiring Models...');
    require('./models/User');
    require('./models/Student');
    require('./models/Room');
    require('./models/Mess');
    require('./models/ShopItem');

    console.log('Requiring Middleware...');
    require('./middleware/authMiddleware');

    console.log('Requiring Controllers...');
    require('./controllers/authController');
    require('./controllers/userController');
    require('./controllers/roomController');
    require('./controllers/messController');
    require('./controllers/shopController');

    console.log('Requiring Routes...');
    require('./routes/authRoutes');
    require('./routes/userRoutes');
    require('./routes/roomRoutes');
    require('./routes/messRoutes');
    require('./routes/shopRoutes');

    console.log('All modules required successfully!');
} catch (err) {
    console.error('FAILED TO REQUIRE MODULE:');
    console.error(err);
    process.exit(1);
}
