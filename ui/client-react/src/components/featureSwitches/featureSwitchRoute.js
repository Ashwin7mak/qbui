import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';

import './featureSwitches.scss';


const columns = [
    {
        property: 'entityType',
        header: {
            label: 'Type'
        },
    },
    {
        property: 'entityValue',
        header: {
            label: 'Name'
        }
    },
    {
        property: 'id',
        header: {
            label: 'ID'
        }
    },
    {
        property: 'on',
        header: {
            label: 'On/Off'
        }
    },
];

export const FeatureSwitchRoute = React.createClass({

    render() {

        let featureSwitch = this.props.switches.find((item) => item.id.toString() === this.props.params.id);
        console.log(featureSwitch);
        return (
            <div className="featureSwitches">
                <h1>Feature Switch Exceptions</h1>
                <Table.Provider className="featureSwitchTable" columns={columns}>

                    <Table.Header />

                    <Table.Body rows={featureSwitch.exceptions} rowKey="id" />
                </Table.Provider>
            </div>
        );
    }
});


const mapStateToProps = (state) => {

    return {
        switches: state.featureSwitches.switches
    };
};


const mapDispatchToProps = (dispatch) => {
    return {

    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureSwitchRoute);
