/**
 * Created by agoel on 4/26/16.
 */

import _ from 'lodash';

const DefaultTableIcon = "iconssturdy-report-table";

const IconPrefix = "icon-TableIcons_sturdy_";

const TagsToIconsMap =  {
    "Regions": "dots",
    "States": "Geography",
    "Cities": "Company",
    "Schools": "backpack",
    "Appointments": "Schedule",
    "Student": "add-person",
    "Feedback": "Hand_Thumbs-up",
    "Financial Aid Applications": "Currency_Sign"
};
const Tags = _.keys(TagsToIconsMap);
class TableIconUtils {
    static getTableIcon(tableName) {
        if (TagsToIconsMap[tableName]) {
            return IconPrefix + TagsToIconsMap[tableName];
        }
        let matchedTag = _.find(Tags, function(tag) {
            if (tag.indexOf(tableName) !== -1 || tableName.indexOf(tag) !== -1) {
                return true;
            }
        });
        if (matchedTag) {
            return IconPrefix + TagsToIconsMap[matchedTag];
        }
        return DefaultTableIcon;
    }
}
export default TableIconUtils;

