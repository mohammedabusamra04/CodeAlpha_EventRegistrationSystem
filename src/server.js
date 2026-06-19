const app = require('./app');
const sequelize = require('./config/database');
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync({ alter: true });
    })
    .then(async () => {
        console.log('Database synced');
        
        try {
            const { seedData } = require('./config/seed');
            await seedData();
        } catch (e) {
            console.error('Database seeding failed during startup:', e);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });