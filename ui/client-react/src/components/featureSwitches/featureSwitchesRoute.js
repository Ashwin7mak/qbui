import React from 'react';
import * as Table from 'reactabular-table';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import {saveSwitches} from '../../actions/featureSwitchActions';
import ToggleButton from 'react-toggle-button'

import './featureSwitches.scss';

import FeatureCheck from './featureCheck';

const columns = [
    {
        property: 'selected',
        header: {
            formatters: [
                (data,extra) => <input type="checkbox"></input>
            ]
        },
        cell: {
            formatters: [
                (data,extra) => <input type="checkbox"></input>
            ]
        }
    },
    {
        property: 'name',
        header: {
            label: 'Switch Name',
        },
        cell: {
            formatters: [
                (data,extra) => <Link to={`/qbase/admin/featureSwitch/${extra.rowData.id}`}>{data}</Link>
            ]
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
        },
        cell: {
            formatters: [
                (data,extra) => <ToggleButton
                    value={ extra.rowData.defaultOn || false }
                    onToggle={(value) => {
                        self.setState({
                            value: !value,
                        })
                    }} />

            ]
        }
    },
];

export const FeatureSwitchesRoute = React.createClass({

    saveSwitches() {
        this.props.saveSwitches(this.props.switches);
    },

    render() {
        return (
            <div className="featureSwitches">
                <h1>Feature Switches</h1>

                <FeatureCheck featureName="Feature A">
                    <h2>Feature A is on!</h2>
                </FeatureCheck>

                <FeatureCheck featureName="Feature B">
                    <h2>Feature B is on!</h2>
                </FeatureCheck>

                <Table.Provider className="featureSwitchTable" columns={getColumns(...this.props)}>

                    <Table.Header />

                    <Table.Body rows={this.props.switches} rowKey="id" />
                </Table.Provider>

                <div>
                    <button onClick={this.saveSwitches}>Save switches</button>
                </div>
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
        saveSwitches: (switches) => {
            dispatch(saveSwitches(switches));
        },
        toggleDefaultState: (id, state) {
            dispatch();
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FeatureSwitchesRoute);
