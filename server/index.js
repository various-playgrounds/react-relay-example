var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type TodoItem {
    name: String!
  }
  type TodoList {
    name: String!
    items: [TodoItem]
  }
  type Query {
    hello: String
    todoList: TodoList
  }
`);

const fakeTodoList = {
  name: 'TodoList',
  items: [
    {
      name: 'item1'
    },
    {
      name: 'item2'
    },
    {
      name: 'item3'
    }
  ]
};

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  todoList: () => {
    return fakeTodoList;
  }
};

var app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');