/**
 * Created by agoel on 4/25/16.
 */
/**
 * This is based on how current stack fills icons for tables without icons.
 * 1st check is to match exact tagname and table name
 * 2nd check is to find if part of table name and tag name matches
 * Leveraging same logic here to fill out icons
 */
import _ from 'lodash';
const defaultTableIcon = "iconssturdy-report-table";

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

export function tableIcon(tableName) {
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
    return defaultTableIcon;
}
