import React from 'react';
import { QueryRenderer} from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import environment from './environment';
import ComponentUsingFragment from './components/ComponentUsingFragment';

export default class App extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query AppQuery {
            hello
            todoList {
              ...ComponentUsingFragment_todoList
            }
          }
        `}
        variables={{}}
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
              </div>
            </div>
          );
        }}
      />
    );
  }
}
