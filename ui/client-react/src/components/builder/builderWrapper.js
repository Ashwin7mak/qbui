import React, {PropTypes} from 'react';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'


const BuilderWrapper = React.createClass({
    // _hasErrorsAndAttemptedSave() {
    //     return (_.has(this.props, 'pendEdits.editErrors.errors') && this.props.pendEdits.editErrors.errors.length > 0 && this.props.pendEdits.hasAttemptedSave);
    // },
    //
    // _doesNotHaveErrors() {
    //     return (!_.has(this.props, 'pendEdits.editErrors.errors') || this.props.pendEdits.editErrors.errors.length === 0 || !this.props.pendEdits.hasAttemptedSave);
    // },
    saveOrCancelFooter() {
        return <SaveOrCancelFooter
            reportData={this.props.reportData}
            shell={this.props.shell}
        />
    },
    render() {
        const childrenWithProps = React.Children.map(this.props.children,
            (child) => React.cloneElement(child, {
                saveOrCancelFooter: this.saveOrCancelFooter()
            })
        );

        return (
            <div className="builderWrapper" >
                {childrenWithProps}
            </div>
        );
    }
});

export default BuilderWrapper;
