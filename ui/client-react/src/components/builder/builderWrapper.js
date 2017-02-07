import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'
import TopNav from '../header/topNav'

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

        return (
            <div className="builderWrapperContent" >
                <div className="builderWrapperChildren">
                    {this.props.children}

                </div>
                <SaveOrCancelFooter
                    rightAlignedButtons={this.getRightAlignedButtons()}
                    centerAligendButtons={this.getCenterAlignedButtons()}
                    leftAligendBUttons={this.getLeftAlignedButtons()} />
            </div>
        );
    }
});

export default BuilderWrapper;
