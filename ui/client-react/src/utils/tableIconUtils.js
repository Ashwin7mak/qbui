/**
 * Created by agoel on 4/26/16.
 */

import _ from 'lodash';

const DEFAULT_TABLE_ICON = "iconssturdy-report-table";

const ICON_PREFIX = "icon-TableIcons_sturdy_";

const TAGS_TO_ICONS_MAP =  {
    "Regions": "dots",
    "States": "Geography",
    "Cities": "Company",
    "Schools": "backpack",
    "Appointments": "Schedule",
    "Student": "add-person",
    "Feedback": "Hand_Thumbs-up",
    "Financial Aid Applications": "Currency_Sign_Dollar2"
};
const Tags = _.keys(TAGS_TO_ICONS_MAP);
class TableIconUtils {
    static getTableIcon(tableName) {
        if (TAGS_TO_ICONS_MAP[tableName]) {
            return ICON_PREFIX + TAGS_TO_ICONS_MAP[tableName];
        }
        let matchedTag = _.find(Tags, function(tag) {
            if (tag.indexOf(tableName) !== -1 || tableName.indexOf(tag) !== -1) {
                return true;
            }
        });
        if (matchedTag) {
            return ICON_PREFIX + TAGS_TO_ICONS_MAP[matchedTag];
        }
        return DEFAULT_TABLE_ICON;
    }
}
export default TableIconUtils;

