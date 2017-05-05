import React, {Component} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import LargeImage from './myappsplaceholder_large.svg';
import SmallImage from './myappsplaceholder_small.svg';
import Breakpoints from '../../utils/breakpoints';
import Locale from '../../../../reuse/client/src/locales/locale';
import './myAppsPage.scss';

/**
 * My Apps page (displays when no app or table is selected)
 */

export class MyAppsPage extends Component {
    constructor(props) {
        super(props);

        this.getPlaceHolderText = this.getPlaceHolderText.bind(this);
        this.horizontalPlaceHolder = this.horizontalPlaceHolder.bind(this);
    }

    getPlaceHolderText() {
        return (
            <div className="appHomePagePlaceHolderText">
                <I18nMessage message="grid.no_rows"/>
            </div>
        );
    }

    horizontalPlaceHolder() {
        return (
            <div className="horizontalPlaceHolder">
                <div className="horizontalPlaceHolderIconLine">
                    <img className="myappsImage animated zoomInDown"
                         alt="Not available"
                         src={Breakpoints.isSmallBreakpoint() ? SmallImage : LargeImage} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="myappsBody">
                <div className="header">{Locale.getMessage('apps.missing')}</div>
                <div className="main">
                    <div className="article">{this.horizontalPlaceHolder()}</div>
                </div>
            </div>
        );
    }
}

export default MyAppsPage;
