import React from 'react';
import {Pager, PageItem} from 'react-bootstrap';

class PaginationComponent  extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {"activePage": 1};
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({activePage:nextProps.currentPage});
    }

    handlePrev() {
        if (this.state.activePage >= 1) {
            this.props.setPage(this.state.activePage - 1);
        }
    }

    handleNext() {
        if (this.state.activePage < this.props.maxPage) {
            this.props.setPage(this.state.activePage + 1);
        }
    }
    render(){
        return (
            <Pager>
                <PageItem next onClick={this.handleNext}>Next</PageItem>
                <PageItem next onClick={this.handlePrev}>Previous</PageItem>
            </Pager>

        );
    }
}
PaginationComponent.defaultProps = {
    "currentPage": 0,
    "maxPage": 0
};
export default PaginationComponent;
