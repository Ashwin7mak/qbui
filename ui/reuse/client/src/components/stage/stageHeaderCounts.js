import React, {PropTypes, Component} from 'react';

import './stageHeaderCounts.scss';

const StageHeaderCounts = ({items, className, stageHeaderHasIcon}) => (
    <div className={`stageHeaderCounts ${className || ''} ${stageHeaderHasIcon ? 'stageHeaderCountsWithIcon' : ''}`}>
        {
            items.map((item, index) => (
                <div key={item.key || index} className="stageHeaderCountItem">
                    <div className="stageHeaderCountDivider">
                        <div className="stageHeaderCount">{item.count}</div>
                        <div className="stageHeaderCountTitle">{item.title}</div>
                    </div>
                </div>
            ))
        }
    </div>
);

StageHeaderCounts.propTypes = {
    /**
     * An array of items to display. */
    items: PropTypes.arrayOf(PropTypes.shape({
        /**
         * An optional key to better key track of this element in an iterator (improves performance if updating frequently).
         * If not provided, the index will be used. */
        key: PropTypes.string,

        /**
         * The number of items. Will display as a large number. */
        count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        /**
         * The title that goes with the count. Will display in smaller text below the count. */
        title: PropTypes.string
    })).isRequired,

    /**
     * A custom class name that can be added to customize styling */
    className: PropTypes.string,

    /**
     * Set to true if the parent stage element has an icon.
     */
    stageHeaderHasIcon: PropTypes.bool
};

export default StageHeaderCounts;
