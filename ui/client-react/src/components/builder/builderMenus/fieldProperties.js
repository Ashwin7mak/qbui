import React, {PropTypes} from 'react';
import SideTrowser from '../../../../../reuse/client/src/components/sideTrowserBase/sideTrowserBase';

import './fieldProperties.scss';

let FieldProperties = React.createClass({
    propTypes: {
    },
    render() {
        return (
            <SideTrowser pullRight={true} sideMenuContent={
                <div className="fieldPropertiesContainer">

                </div>
            }>
                {this.props.children}
            </SideTrowser>
        );
    }
});

export default FieldProperties;
