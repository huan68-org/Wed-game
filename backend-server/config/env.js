module.exports = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'hunghel1oss',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'hunghel1oss',
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '15m',
    REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '7d',
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://ffthelight_db_user:hung27012002@cluster0.uclix47.mongodb.net/?appName=Cluster0',
    PORT: process.env.PORT || 8080,
    EMAIL_USER: process.env.EMAIL_USER || 'ffthelight@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'oosp yctm gjjh tfrh'
};
