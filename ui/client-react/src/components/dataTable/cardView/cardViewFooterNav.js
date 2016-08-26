/**
 * Created by bstookey on 8/25/16.
 */
import React from 'react';
import Loader  from 'react-loader';
import './cardViewList.scss';
// import {I18nMessage} from '../../src/utils/i18nMessage';

var CardViewFooterNav = React.createClass({
    propTypes: {
        getNextReportPage: React.PropTypes.func,
    },

    /**
     * renders the report footer next button
     */
    render() {
        console.log('isCounting cardViewFooterNav: ', this.props.isCounting);
        let dbl = null;
        var loaderOptions = {
            lines: 7,
            length: 0,
            width: 5,
            radius: 5,
            scale: 1,
            corners: 1,
            opacity: 0,
            rotate: 0,
            direction: 1,
            speed: 1.1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '95%',
            left: '50%',
            shadow: false,
            hwaccel: false,
            position: 'absolute'
        };

        return (
            <div>
                <button className="top-card-row field" style = {{width:'400px'}} onClick={this.props.getNextReportPage}> Next page</button>
                <Loader loaded={this.props.isCounting} options={loaderOptions}>
                </Loader>
                {!this.props.isCounting ?
                    (<div style={{height: '100px', width: '100px'}} className="recordsCount" onDoubleClick={dbl}></div>)
                    :null
                }
            </div>
                );

    }
});

export default CardViewFooterNav;
