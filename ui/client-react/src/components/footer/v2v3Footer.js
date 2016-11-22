import React from 'react';
import {Button, Panel} from 'react-bootstrap';
import QBicon from '../qbIcon/qbIcon';
import {PropTypes} from 'react';
import {I18nMessage} from '../../../src/utils/i18nMessage';
import './v2v3Footer.scss';

var V2V3Footer = React.createClass({

    propTypes: {
        /**
         * 2 (classic) or 3 (Mercury)
         */
        version: PropTypes.number.isRequired,
        /**
         * callback when radio button is selected
         */
        onSelectUIVersion: PropTypes.func.isRequired
    },

    getInitialState() {
        return {open: false};
    },

    render() {
        const openClosed = this.state.open ?  "open" : "closed";

        return (
            <div className={"popupFooter "  + openClosed} >
                <div className="popupFooterTitle" onClick={ ()=> this.setState({open: !this.state.open})}>
                    <div className="popupFooterTitleLabel"><I18nMessage message="v2v3.manageAccessTitle" /></div>
                    <a href="#" className="popupFooterToggle">
                        <QBicon icon="caret-down"/>
                    </a>
                </div>

                <Panel className="popupFooterMain" collapsible expanded={this.state.open}>
                    <div className="v2v3radioTitle"><I18nMessage message="v2v3.versionSelectTitle" /></div>
                    <div>
                        <label>
                            <input type="radio"
                                   name="v2v3"
                                   checked={this.props.version === 2}
                                   onChange={()=>this.props.onSelectUIVersion(2)}/> <I18nMessage message="quickBaseClassic" />
                        </label>
                    </div>
                    <div>
                        <label>
                            <input type="radio"
                                   name="v2v3"
                                   checked={this.props.version === 3}
                                   onChange={()=>this.props.onSelectUIVersion(3)}/> <I18nMessage message="quickBaseMercury" />
                        </label>
                    </div>

                    <div className="popupFooterMainTip"><I18nMessage message="v2v3.manageAccessTip" /></div>
                </Panel>
            </div>
        );
    }
});

export default V2V3Footer;
