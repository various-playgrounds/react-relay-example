import React from 'react';
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';


class ComponentUsingRefetchContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    render() {
        const todoItem = this.props.todoItem;
        if (todoItem === null) {
            return (
                <div>
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                    <button onClick={this._refetch}>refresh</button>
                    <span>todo item not found!</span>
                </div> 
            );
        }
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
                <button onClick={this._refetch}>refresh</button>
                <span>name: {todoItem.name}</span>
            </div>
        )
    }

    _refetch = () => {
        this.props.relay.refetch(
            {id: this.state.value},
            null,
            () => {
                console.log('Refetch done');
                this.props.setId(this.state.value);
            },
            {force: true},
        )
    }
}

export default createRefetchContainer(
    ComponentUsingRefetchContainer,
    {
        todoItem: graphql`
            fragment ComponentUsingRefetchContainer_todoItem on TodoItem
            @argumentDefinitions(id: {type: "String"}) {
                name
            }
        `
    },
    graphql`
        query ComponentUsingRefetchContainerRefetchQuery($id: String!) {
            todoItem (id: $id) {
                ...ComponentUsingRefetchContainer_todoItem @arguments(id: $id)
            }
        }
    `,
    
);