const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()

app.use(morgan('dev'));
app.use(cors())

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

const url = process.env.MONGODB_URI || 'mongodb://localhost/traveldb'

console.log('URL : ',url);

mongoose.connect(
    url, { useNewUrlParser: true,  useUnifiedTopology: true }
).then(connect => console.log('connected to mongodb..'))
.catch(e => console.log('could not connect to mongodb', e))


// parse application/x-www-form-urlencoded
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.1', 
      info: {
        version: "1.0.0",
        title: "API",
        description: "API Information for tourist app",
        contact: {
          name: "Yash Pratap"
        },
        servers: ["http://localhost:3000"]
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'jwt',
          }
        }
      },
      security: [{
        bearerAuth: []
      }]
    },
    apis: [
      "./docs/**/*.yaml",      
    ]
};
  

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/place', require('./api/route/place'))

app.post('/test',(req, res)=>{

  console.log('testing ...')
  const {test, name} = req.body
  console.log(`value of test = ${JSON.stringify(test, null, 2)}`)
  console.log(`value of name = ${JSON.stringify(name, null, 2)}`)

  res.json({
    r:{name:'qweqwe'}
  })

})

const PORT = process.env.PORT || 3005 

app.listen(PORT,()=>{
  console.log('Welcome to tourist app')
})

