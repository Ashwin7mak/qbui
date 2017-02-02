import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';

import './featureSwitchAdmin.scss';


const columns = [
    {
        property: 'name',
        header: {
            label: 'Switch Name'
        }
    },
    {
        property: 'team',
        header: {
            label: 'Team'
        }
    },
    {
        property: 'description',
        header: {
            label: 'Description'
        }
    },
    {
        property: 'defaultOn',
        header: {
            label: 'Default On/Off'
        }
    },
];

export const FeatureSwitchAdminRoute = React.createClass({
    render() {
        return (
            <div className="featureSwitches">
                <h1>Feature Switches</h1>
                <Table.Provider className="featureSwitchTable" columns={columns}>

                    <Table.Header />

                    <Table.Body rows={this.props.switches} rowKey="id" />
                </Table.Provider>
            </div>
        );
    }
});


const mapStateToProps = (state) => {
    console.log(state);
    return {
        statuses: state.featureSwitches.statuses,
        switches: state.featureSwitches.switches,
        exceptions: state.featureSwitches.exceptions
    };
};


const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureSwitchAdminRoute);
