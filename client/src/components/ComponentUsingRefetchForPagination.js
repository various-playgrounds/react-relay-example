import React from 'react';
import { createRefetchContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';


class ComponentUsingRefetchForPagination extends React.Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(props))
        this.state = {
            page: props.page,
        };
    }

    handleChangePage = (event) => {
        this.setState({page: event.target.value});
    }

    render() {
        const todoList = this.props.todoListPagination;
        return (
            <div>
                -------------------------------------------------------------------------------------
                <p>{todoList.name}</p>
                <input type="text" value={this.state.page} onChange={this.handleChangePage} />
                <button onClick={this.onSubmit}>page</button>
                <ul>
                    {todoList.items.map((item) => {
                        return (
                            <li key={item.id}>
                                <span>id: {item.id}</span>{'------'}
                                <span>Name: {item.name}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }

    onSubmit = () => {
        const skip = parseInt(this.state.page) * 2;
        const take = 3;
        console.log(skip, take);
        this.props.relay.refetch(
            {skip, take},
            null,
            () => {
                this.props.setPage(this.state.page);
                console.log('updated!');
            },
        )
    }
}

export default createRefetchContainer(
    ComponentUsingRefetchForPagination,
    {
        todoListPagination: graphql`
            fragment ComponentUsingRefetchForPagination_todoListPagination on TodoList
            @argumentDefinitions(take: {type: "Int"}, skip: {type: "Int"}) {
                name
                items {
                    name
                    id
                }
            }
        `
    },
    graphql`
        query ComponentUsingRefetchForPaginationRefetchQuery($skip: Int, $take: Int) {
            todoListPagination (skip: $skip, take: $take) {
                ...ComponentUsingRefetchForPagination_todoListPagination @arguments(take: $take, skip: $skip)
            }
        }
    `,
    
);