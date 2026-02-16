require('dotenv').config();
console.log('MONGO_URI Present:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    console.log('MONGO_URI Start:', process.env.MONGO_URI.substring(0, 20));
}
