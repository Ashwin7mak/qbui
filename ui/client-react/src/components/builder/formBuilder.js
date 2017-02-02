import React, {PropTypes} from 'react';


const FormBuilder = React.createClass({
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.number,
    },
    render() {
        return(
            <div>
                <h1>Hello!</h1>
            </div>
        )
    }
});

export default FormBuilder;
