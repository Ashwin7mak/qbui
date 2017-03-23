import React, {PropTypes, Component} from 'react';
import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import InkTabBar from 'rc-tabs/lib/InkTabBar';

import 'rc-tabs/assets/index.css';
import './tabbedSideMenu.scss';


/**
 * Used to create a side nav that has tabbed navigation within it.
 * HEADS UP: Pass this component into either SideMenuBase or SideTrowser as the sideMenuContent.
 * TODO:: This is a very basic implementation. Additional styling and behavior will be added once when we have the final spec.
 */
class TabbedSideNav extends Component {
    constructor(props) {
        super(props);

        this.getDefaultTab = this.getDefaultTab.bind(this);
        this.onTabChanged = this.onTabChanged.bind(this);
        this.onTabClicked = this.onTabClicked.bind(this);
    }

    onTabChanged(tabKey) {
        if (this.props.onTabChanged) {
            this.props.onTabChanged(tabKey);
        }
    }

    onTabClicked(tabKey) {
        if (this.props.onTabClicked) {
            this.props.onTabClicked(tabKey);
        }
    }

    getDefaultTab() {
        if (this.props.defaultTab) {
            return this.props.defaultTab;
        }

        if (this.tabs && this.tabs.length > 0) {
            return this.tabs[0].key;
        }
    }

    render() {
        return (
            <div className="tabbedSideNav">
                <Tabs
                    defaultActiveKey={this.getDefaultTab()}
                    onChange={this.onTabChanged}
                    renderTabBar={() => <InkTabBar onTabClick={this.onTabClicked} />}
                    renderTabContent={() => <TabContent />}
                >
                    {this.props.tabs.map(tab => (
                        <TabPane tab={tab.title} key={tab.key}>{tab.content}</TabPane>
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
        key: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,

        /**
         * The text that displays in the tab */
        title: PropTypes.string.isRequired,

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
