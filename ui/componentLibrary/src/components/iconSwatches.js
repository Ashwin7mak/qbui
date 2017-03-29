import React, {PropTypes} from 'react';
import Tooltip from '../../../reuse/client/src/components/tooltip/tooltip';

/**
 * component to render icon examples from a CSS file that defines an icon font
 *
 * @param cssFileContents contents of an SCSS file to process
 */
const IconSwatches = ({cssFileContents}) => {

    let lines = cssFileContents.replace(/\/\*[^*]*\*\//g, ""); // strip out C-style /* */ comments
    lines = lines.replace(/\r|\n/g, ""); // remove all CR and LF (put everything on one line)
    lines = lines.replace(/}/g, "}\n"); // insert line breaks after every close curly brace so each declaration is on a single line
    lines = lines.split("\n"); // split on LF boundaries
    let icons = [];

    // iterate over lines and pull out the data
    // todo: consider changing this to parse globally instead of by line
    // todo: and switch to use the reduce() pattern.
    lines.forEach(line => {

        // extract the class name and character code
        // \1 = class name without a leading .
        // \2 = character code without a leading \
        // select from the beginning of the line, any amount of whitespace,
        // followed by a period, followed by one or more non-colon characters (all icons have a :before or :after on them),
        // followed by any amount of whitespace, followed by a colon character,
        // followed by any number of characters, followed by content:,
        // followed by any amount of whitespace, followed by a double quote,
        // followed by a backslash, followed by one or more non-quote characters,
        // followed by a quote character
        let lineData = line.match(/^[\s]*\.([^:]+)[\s]*\:.*content:[\s]*\"\\([^\"]+)\"/);

        // if we found an icon and there is both a class name and code point...
        if (lineData && lineData.length > 2) {

            // initialize the icon from the data extracted from the regex
            let icon = {
                className: lineData[1],
                iconName: lineData[1].substring(lineData[1].indexOf('-')+1), // extract the part of the classname after the first hyphen
                charCode: lineData[2]
            };

            // calculate the actual unicode character
            let n = parseInt(icon.charCode, 16);
            icon.character = String.fromCharCode(n);

            icons.push(icon);
        }
    });

    return (
        <ul className="comp-library-icon-grid">
            {icons.map( (icon, index) =>
                <li key={index} className="comp-library-icon-swatch">
                    <Tooltip plainMessage={`${icon.iconName} [${icon.charCode}]`} location="bottom">
                        <span className={`qbicon ${icon.className}`}>
                            <input type="text" maxlength="1" readonly value={icon.character} className="comp-library-icon-input"/>
                        </span>
                    </Tooltip>
                    <span className="comp-library-icon-label">{icon.iconName}</span></li>
            )}
        </ul>

    );
};

IconSwatches.propTypes = {
    cssFileContents: React.PropTypes.string.isRequired
};

export default IconSwatches;
