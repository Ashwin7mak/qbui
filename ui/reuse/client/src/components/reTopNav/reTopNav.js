import React, {PropTypes, Component} from 'react';
import QBicon from '../../../../../client-react/src/components/qbIcon/qbIcon';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import QbTooltip from '../../../../../client-react/src/components/qbToolTip/qbToolTip';

import './reTopNav.scss';

class ReTopNav extends Component {
    constructor(props) {
        super(props);

        this.getTopTitle = this.getTopTitle.bind(this);
    }

    getTopTitle() {
        let {title} = this.props;

        if (title) {
            return (
                <div className="topTitle">
                    {title}
                </div>
            );
        }

        return null;
    }


    render() {
        let {showOnSmall, onNavClick, globalActions} = this.props;

        const classes = `topNav${(showOnSmall ? '' : ' hideSmall')}`;

        return (
            <div className={classes}>
                <div className="top">
                    <div className="navGroup left">
                        <ButtonGroup className="navItem">
                            <Button tabIndex="1"  className="iconLink toggleNavButton" onClick={onNavClick}>
                                <QBicon icon="hamburger" />
                            </Button>

                            {this.getTopTitle()}
                        </ButtonGroup>
                    </div>

                    <div className="navGroup center">

                        <ButtonGroup className="navItem">

                            <QbTooltip i18nMessageKey="unimplemented.search" location="bottom">
                                <Button tabIndex="2" className="disabled">
                                    <QBicon icon="search" />
                                </Button>
                            </QbTooltip>

                            <QbTooltip i18nMessageKey="unimplemented.favorites" location="bottom">
                                <Button tabIndex="3" className="disabled"><QBicon icon="star-full" /></Button>
                            </QbTooltip>
                        </ButtonGroup>
                    </div>

                    <div className="navGroup right">
                        {globalActions}
                    </div>
                </div>
            </div>
        );
    }
}

ReTopNav.propTypes = {
    showOnSmall: PropTypes.bool,
    title: PropTypes.node,
    onNavClick: PropTypes.func,
    globalActions: PropTypes.element
};

ReTopNav.defaultProps = {
    showOnSmall: false,
};

export default ReTopNav;
