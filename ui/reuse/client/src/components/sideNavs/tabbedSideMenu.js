import React, {PropTypes, Component} from 'react';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import InkTabBar from 'rc-tabs/lib/InkTabBar';

import 'rc-tabs/assets/index.css';
import './tabbedSideMenu.scss';

/**
 * Used to create a side nav that has tabbed navigation within it.
 * HEADS UP: Pass this component into either SideMenuBase or SideTrowser as the sideMenuContent.
 */
class TabbedSideNav extends Component {
    constructor(props) {
        super(props);
    }

    getDefaultTab = () => {
        if (this.props.defaultTab) {
            return this.props.defaultTab;
        }

        if (this.props.tabs && this.props.tabs.length > 0) {
            return this.props.tabs[0].key;
        }

        return null;
    };

    render() {
        let classes = ["tabbedSideNav"];
        if (this.props.isCollapsed) {
            classes.push('hideTabs');
        }

        return (
            <div className={classes.join(' ')}>
                <Tabs
                    defaultActiveKey={this.getDefaultTab()}
                    onChange={this.props.onTabChanged}
                    renderTabBar={() => <InkTabBar onTabClick={this.props.onTabClicked} />}
                    renderTabContent={() => <TabContent animated={false}/>}
                >
                    {this.props.tabs.map(tab => (
                        <TabPane tab={tab.title} key={tab.key} forceRender={true}>{tab.content}</TabPane>
                    ))}
                </Tabs>
            </div>
        );
    }
}

TabbedSideNav.propTypes = {
    /**
     * The key of the tab that should be selected if no activeKey.
     * If not provided, the default tab is the first tab. */
    defaultTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * The tabs and their content */
    tabs: PropTypes.arrayOf(PropTypes.shape({
        /**
         * A unique key that identifies the tab */
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

        /**
         * The text that displays in the tab. It can be a string or React element. */
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

        /**
         * The content of the tab described in html/jsx */
        content: PropTypes.node
    })),

    /**
     * A callback that occurs when a tab changes. It will receive the tab key as a single argument. */
    onTabChanged: PropTypes.func,

    /**
     * A callback that occurs when one of the tabs is clicked. It will receive the tab key as a single argument. */
    onTabClicked: PropTypes.func
};

TabbedSideNav.defaultProps = {
    tabs: []
};

export default TabbedSideNav;
