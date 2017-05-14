import React, {Component} from "react";
import {I18nMessage} from '../../utils/i18nMessage';
import EmptyImage from '../../../src/assets/images/QB_logo_ghost-opt.svg';
import Locale from '../../../../reuse/client/src/locales/locale';
import './appHomePage.scss';

/**
 * App Home page (displays when no app or table is selected)
 */

export class AppHomePage extends Component {
    constructor(props) {
        super(props);

        this.getPlaceHolderText = this.getPlaceHolderText.bind(this);
        this.horizontalPlaceHolder = this.horizontalPlaceHolder.bind(this);
        this.verticalPlaceHolder = this.verticalPlaceHolder.bind(this);
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
                    <img className="noRowsIcon animated zoomInDown" alt="Not available" src={EmptyImage} />
                </div>
            </div>
        );
    }

    verticalPlaceHolder() {
        return (
            <div className="verticalPlaceHolder">
                <div className="verticalPlaceHolderIconLine">
                    <img className="noRowsIcon animated zoomInDown" alt="Not available" src={EmptyImage} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="appHomePageBody">
                <div className="header">{Locale.getMessage('app.dashboards.missing')}</div>
                <div className="main">
                    <div className="article">{this.horizontalPlaceHolder()}{this.horizontalPlaceHolder()}</div>
                    <div className="nav">{this.verticalPlaceHolder()}</div>
                </div>
            </div>
        );
    }
}

export default AppHomePage;
