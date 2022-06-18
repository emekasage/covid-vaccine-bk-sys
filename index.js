import app from "./server.js"
import dotenv from "dotenv"
import mongoose from 'mongoose';

// configure environment variables
dotenv.config();

// db config
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Started up at port ${port}`);
    });
});

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
