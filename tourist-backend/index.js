const express = require('express');
const morgan = require('morgan');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/traveldb';
const port = process.env.PORT || 3005;

console.log('MongoDB URL:', mongoUrl);

mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB.'))
  .catch((error) => console.error('Could not connect to MongoDB:', error));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      version: '1.0.0',
      title: 'Tourist API',
      description: 'API information for the tourist app.',
      contact: {
        name: 'Yash Pratap',
      },
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ['./docs/**/*.yaml'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/place', require('./api/route/place'));

app.post('/test', (req, res) => {
  res.json({
    r: { name: 'qweqwe' },
  });
});

app.listen(port, () => {
  console.log(`Tourist API is running on port ${port}.`);
});

