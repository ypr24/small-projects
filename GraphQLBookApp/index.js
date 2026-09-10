const express = require('express')
const morgan  = require('morgan')

const { graphqlHTTP } = require('express-graphql');

const {makeExecutableSchema,} = require('@graphql-tools/schema');
const {mergeResolvers, mergeTypeDefs} = require('@graphql-tools/merge')
const cors = require('cors')

const app = express()


app.use(cors())
app.use(morgan('dev'))

app.get('/test',(req,res)=>{
    res.json({test:"testing ..."});
})

const mainRes = require('./graphql/schemas/main-resolver')
const mainTypes = require('./graphql/schemas/main-type')

registerTypes = mergeTypeDefs([mainTypes])
registerResolvers = mergeResolvers([mainRes])


app.use('/graphql', graphqlHTTP({
  schema: makeExecutableSchema({
    typeDefs: registerTypes,
    resolvers: registerResolvers,
  }),
  graphiql: true
}))

const PORT = process.env.PORT || 3005

app.listen(PORT, ()=>{
    console.log("Welcome to GraphQL tutorial");
})