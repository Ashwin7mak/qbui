import React from 'react';
import QBToolTip from '../qbToolTip/qbToolTip';
import Breakpoints from '../../utils/breakpoints';

const ValidatedFieldWrapper = (FieldComponent) => {

    return class extends React.Component
    {
        render() {
            let isSmall = Breakpoints.isSmallBreakpoint();

            if (this.props.isInvalid) {
                return (
                    isSmall ? <div className="errorContainer">
                                <FieldComponent {...this.props}/>
                                <div>{this.props.invalidMessage}</div>
                            </div> :
                        <QBToolTip location="top" tipId="invalidInput" delayHide={3000}
                                   plainMessage={"test"}>
                            <FieldComponent {...this.props}/>
                        </QBToolTip>);
            } else {
                return <FieldComponent {...this.props}/>;
            }
        }
    };
};

export default ValidatedFieldWrapper;
