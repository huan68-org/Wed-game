module.exports = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '15m',
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '7d',
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://ffthelight_db_user:hung27012002@cluster0.uclix47.mongodb.net/?appName=Cluster0',
    PORT: process.env.PORT || 8080
};
