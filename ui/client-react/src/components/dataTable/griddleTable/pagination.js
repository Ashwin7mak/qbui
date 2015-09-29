import React from 'react';
import { Pagination } from 'react-bootstrap';

class PaginationComponent  extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {"activePage": 1}
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({activePage:nextProps.currentPage + 1});
    }
    handleSelect(event, selectedEvent) {
        this.setState({activePage: selectedEvent.eventKey - 1});
        this.props.setPage(selectedEvent.eventKey -1);
    }
    render(){
        return (
            <Pagination
                prev
                next
                first
                last
                ellipsis
                items={this.props.maxPage}
                activePage={this.state.activePage}
                onSelect={this.handleSelect} />
        );
    }
}
PaginationComponent.defaultProps = {
    "currentPage": 0,
    "maxPage": 0
}
export default PaginationComponent;