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
    todoListPagination(skip: Int, take: Int): TodoList
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

const fakeTodoListPagination = {
  name: 'todoListPagination',
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
    },
    {
      name: 'item4',
      id: '4',
    },
    {
      name: 'item5',
      id: '5',
    },
    {
      name: 'item6',
      id: '6',
    },
    {
      name: 'item7',
      id: '7',
    },
    {
      name: 'item8',
      id: '8',
    },
    {
      name: 'item9',
      id: '9',
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
  },
  todoListPagination: ({take, skip}) => {
    if (take != null && skip != null && skip > 0 && take > 0) {
      return {
        name: fakeTodoListPagination.name,
        items: fakeTodoListPagination.items.slice(skip, skip+take),
      }
    } else if (skip != null && skip > 0 && take > 0) {
      return {
        name: fakeTodoListPagination.name,
        items: fakeTodoListPagination.items.slice(skip),
      };
    } else if (take != null && take > 0) {
      return {
        name: fakeTodoListPagination.name,
        items: fakeTodoListPagination.items.slice(0, take),
      };
    }
    return fakeTodoListPagination;
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