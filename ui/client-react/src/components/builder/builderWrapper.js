import React, {PropTypes} from 'react';
import FormBuilder from './formBuilder';


const Builder = React.createClass({
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.number,
    },
    render() {
        return <FormBuilder/>
    }
});

export default Builder;