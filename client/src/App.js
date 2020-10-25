import React from 'react';
import { QueryRenderer} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import environment from './environment';
import ComponentUsingFragment from './components/ComponentUsingFragment';
import ComponentUsingRefetchContainer from './components/ComponentUsingRefetchContainer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    };
  }
  updateId = (id) => {
    this.setState({
      id,
    })
  }
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery ($id: String!) {
            hello
            todoList {
              ...ComponentUsingFragment_todoList
            }
            todoItem(id: $id) {
              ...ComponentUsingRefetchContainer_todoItem @arguments(id: $id)
            }
          }
        `}
        variables={{
          id: this.state.id,
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
              </div>
            </div>
          );
        }}
      />
    );
  }
}
