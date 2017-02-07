import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'


const BuilderWrapper = React.createClass({
    onCancel() {
        //This will redirect to previous page
        console.log('Canceling!');
    },
    saveClicked() {
        //This will connect with redux
        console.log('Saving!');
    },

    getRightAlignedButtons() {
      return(
          <div>
            <Button bsStyle="primary" onClick={this.onCancel}><I18nMessage message="nav.cancel"/></Button>
            <Button bsStyle="primary" onClick={this.saveClicked}><I18nMessage message="nav.save"/></Button>
          </div>
      );
    },

    getLeftAlignedButtons() {
        return <div></div>
    },

    getCenterAlignedButtons() {
        return <div className={"centerActions"} />;

    },

    saveOrCancelFooter() {
        return <SaveOrCancelFooter
            rightAlignedButtons={this.getRightAlignedButtons()}
            centerAligendButtons={this.getCenterAlignedButtons()}
            leftAligendBUttons={this.getLeftAlignedButtons()}
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
