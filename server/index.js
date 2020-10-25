var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const cors = require('cors')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type TodoItem {
    name: String!
    id: String!
  }
  type TodoList {
    name: String!
    items: [TodoItem]
  }
  type Query {
    hello: String
    todoList: TodoList
    todoItem(id: String!): TodoItem
  }
`);

const fakeTodoList = {
  name: 'TodoList',
  items: [
    {
      name: 'item1',
      id: '1',
    },
    {
      name: 'item2',
      id: '2',
    },
    {
      name: 'item3',
      id: '3',
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
  },
  todoItem: ({id}) => {
    const res = fakeTodoList.items.filter((item) => {
      return item.id === id;
    });
    return res.length > 0? res[0]: null;
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