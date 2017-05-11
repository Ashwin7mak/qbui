import React, {PropTypes, Component} from "react";
import StandardGridNavigation from "./StandardGridNavigation";
import StandardGridUsersCount from "./StandardGridUsersCount";
import * as StandardGridActions from "../../../common/grid/standardGridActions";
import IconInputBox from "../../../../../reuse/client/src/components/iconInputBox/iconInputBox";
import {connect} from "react-redux";
import './StandardGridToolBar.scss';

/**
 * The toolbar for Standard Grid
 */
class StandardGridToolBar extends React.Component {

    constructor(...args) {
        super(...args);
    }


// && (!_.isUndefined(this.props.reportData))
    render() {
        let isLoading = false;
        let isError = false;
        let filteredRecordCount = null;
        // This is the count of all records that apply to this report
        let totalRecords = 0;
        return (
            <div className="standardGridToolBar">
                <div className="standardGridSearch">
                    <IconInputBox placeholder="Search users"
                                  onChange={this.props.onSearchChange}/>
                </div>
                <div>
                    {!isLoading && !isError ?
                        <StandardGridUsersCount totalRecords={this.props.totalRecords}
                                                filteredRecords={this.props.filteredRecords}
                        /> :
                        null
                    }
                </div>
                <div className="standardGridNavigation">
                    <StandardGridNavigation getPreviousUsersPage={this.props.getPreviousUsersPage}
                                            getNextUsersPage={this.props.getNextUsersPage}
                                            id={this.props.id}/>
                </div>
            </div>
        );
    }
}

StandardGridToolBar.propTypes = {
    id: PropTypes.string,
    getPreviousUsersPage: PropTypes.func.isRequired,
    getNextUsersPage: PropTypes.func.isRequired,
    doUpdate: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    totalRecords: PropTypes.number.isRequired
};


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getPreviousUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, -1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        getNextUsersPage: () => {
            dispatch(StandardGridActions.setCurrentPageOffset(ownProps.id, 1));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        },

        onSearchChange: (searchEvent) => {
            dispatch(StandardGridActions.setSearch(ownProps.id, searchEvent.target.value));
            dispatch(StandardGridActions.doUpdate(ownProps.id, ownProps.doUpdate));
        }
    };
};

export {StandardGridToolBar};

export default connect(undefined, mapDispatchToProps)(StandardGridToolBar);
