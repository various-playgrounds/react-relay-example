import React from 'react';
import { QueryRenderer} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import environment from './environment';
import ComponentUsingFragment from './components/ComponentUsingFragment';
import ComponentUsingRefetchContainer from './components/ComponentUsingRefetchContainer';
import ComponentUsingRefetchForPagination from './components/ComponentUsingRefetchForPagination';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      page: 0,
    };
  }
  
  updateId = (id) => {
    this.setState({
      id,
    })
  }

  updatePage = (page) => {
    this.setState({
      page
    })
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery ($id: String!, $skip: Int, $take: Int) {
            hello
            todoList {
              ...ComponentUsingFragment_todoList
            }
            todoItem(id: $id) {
              ...ComponentUsingRefetchContainer_todoItem @arguments(id: $id)
            }
            todoListPagination (skip: $skip, take: $take) {
              ...ComponentUsingRefetchForPagination_todoListPagination @arguments(skip: $skip, take: $take)
            }
          }
        `}
        variables={{
          id: this.state.id,
          skip: this.state.page * 3,
          take: 3,
        }}
        render={({error, props}) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <div>
              {props.hello}
              <div>
                <ComponentUsingFragment todoList={props.todoList}/>
                <ComponentUsingRefetchContainer todoItem={props.todoItem} setId={this.updateId} />
                <ComponentUsingRefetchForPagination todoListPagination={props.todoListPagination} setPage={this.updatePage} page={this.state.page}/>
              </div>
            </div>
          );
        }}
      />
    );
  }
}
