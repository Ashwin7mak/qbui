import React, {PropTypes} from 'react';
import './formBuilder.scss'


const FormBuilder = React.createClass({
    propTypes: {
        /**
         * the raw value to be saved */
        value: React.PropTypes.number,
    },
    render() {
        return(
            <div>
                <h1 className="formBuilderHeader">Welcome To Form Builder</h1>
            </div>
        )
    }
});

export default FormBuilder;
