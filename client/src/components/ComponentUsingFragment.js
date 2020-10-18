import React from 'react';
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';


class ComponentUsingFragment extends React.Component {
    render() {
        const todoList = this.props.todoList;
        return (
            <div>
                <span>{todoList.name}</span>
                <ul>
                    {todoList.items.map(item => {
                        return <li>{item.name}</li>
                    })}
                </ul>
            </div>
        )
    }
}

export default createFragmentContainer(ComponentUsingFragment, {
    todoList: graphql`
        fragment ComponentUsingFragment_todoList on TodoList {
            name
            items {
                name
            }
        }
    `
});