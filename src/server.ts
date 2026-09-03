import app from '../src/app.js';
import config from './config/config.js';
import connectDB from './config/database.js';

connectDB();

app.listen(config.PORT, () => {
  console.log('Server running on port: ', config.PORT);
});
