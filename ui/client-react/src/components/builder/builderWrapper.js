import React from 'react';
import {I18nMessage} from '../../utils/i18nMessage';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import './builderWrapper.scss';
import SaveOrCancelFooter from '../saveOrCancelFooter/saveOrCancelFooter'


const BuilderWrapper = React.createClass({

    saveClicked() {
        //This will connect with redux
    },

    getRightAlignedButtons() {
      return <Button bsStyle="primary" onClick={() => {this.saveClicked(false);}}><I18nMessage message="nav.save"/></Button>
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
