import React, {PropTypes} from 'react';
import FormBuilder from './formBuilder';


const BuilderWrapper = React.createClass({
    render() {
        /**
         *formId is set to null for now, it is left here, because formId will need to be passed down as a prop in a future story
         * */
        const formId= null;
        const {appId, tblId} = this.props.params;
        const formType = this.props.location.query.formType;

        return <FormBuilder appId={appId}
                            tblId={tblId}
                            formType={formType}
                            formId={formId}/>;
    }
});

export default BuilderWrapper;
