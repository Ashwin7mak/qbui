import React, {PropTypes} from 'react';
import Tooltip from '../../../reuse/client/src/components/tooltip/tooltip';

/**
 * component to render color swatches from an SCSS file with color variables in it
 *
 * @param scssFileContents contents of an SCSS file to process
 */
const ColorSwatches = ({scssFileContents}) => {

    let lines = scssFileContents.replace(/\/\*[^*]*\*\//g, ""); // strip out C-style /* */ comments
    lines = lines.replace(/\r\n/g, "\n"); // normalize CRLF to LF
    lines = lines.split("\n"); // split on LF boundaries
    let groups = [];
    let colors = new Array(); // always a fresh one

    // iterate over lines and pull out the data
    // todo: consider changing this to parse globally instead of by line
    // todo: and switch to use the reduce() pattern.
    lines.forEach(line => {

        // see if we have a group comment
        // if we have a group comment and if we already have colors,
        // push them onto the groups collection and create a new empty set of colors.
        if (line.indexOf("//==") >= 0) {
            if (colors.length > 0) {
                groups.push({
                    colors: colors
                });
            }
            colors = new Array(); // always a fresh one
        } else {

            // extract the variable name and color value
            // \1 = variable name without leading $
            // \2 = color value including leading #
            // \3 = remaining text after the variable declaration's closing semicolon
            // select from the beginning of the string, any amount of whitespace,
            // followed by $color-, followed by one or more non colon characters,
            // followed by any amount of whitespace, followed by a colon,
            // followed by any amount of whitespace, followed by one or more non-semicolon characters,
            // followed by any amount of whitespace, followed by a semicolon,
            // and then the rest of the line
            let lineData = line.match(/^[\s]*\$(color-[^:]+)[\s]*\:[\s]*([^;]+)[\s]*;(.*)$/);

            // if we found a variable line and there is a variable name and value...
            if (lineData && lineData.length > 2) {
                // initialize the color from the data extracted from the regex
                let color = {
                    varName: lineData[1],
                    varValue: lineData[2]
                };

                // Extract commented text from the remaining text after the variable declaration.
                // The comment text is optional.
                if (lineData.length > 3) {

                    // \1 = characters to the right of a line comment with leading and trailing whitespace removed
                    let commentData = lineData[3].match(/\/\/[\s]*(.*)[\s]*$/);

                    if (commentData && commentData.length > 1) {
                        color.description = commentData[1];
                    }
                }

                // figure out text color by converting background color RGB hex value to HSL and pull out the L value
                var c = color.varValue.substring(1);      // strip #
                if (c.length === 3) {
                    // convert 3-digit hex codes to 6-digit
                    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
                }
                var rgb = parseInt(c, 16);  // convert rrggbb to decimal
                var r = (rgb >> 16) & 0xff; // extract red
                var g = (rgb >> 8) & 0xff;  // extract green
                var b = (rgb >> 0) & 0xff;  // extract blue

                var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

                // if the color is dark, make the text white
                // if the color is light, make the text black
                if (luma < 128) {
                    color.textColor = "#fff";
                } else {
                    color.textColor = "#000";
                }

                // if the color is very very light, turn on the border
                if (luma > 250) {
                    color.borderClass = "comp-library-color-swatch-needs-border";
                } else {
                    color.borderClass = "";
                }

                // if there is no description, provide default text
                if (!color.description || color.description.trim().length === 0) {
                    color.description = "No information";
                }

                colors.push(color);
            }
        }

    });

    // after processing all the lines, if we have a last group of colors, push them
    if (colors.length > 0) {
        groups.push({
            colors: colors
        });
    }

    return (
        <div className="comp-library-color-grid">
        {groups.map( (group, groupIndex) =>
            <ul key={groupIndex} className="comp-library-color-group">
            {group.colors.map( (color, colorIndex) =>
                <Tooltip key={colorIndex} plainMessage={color.description} location="right">
                    <li key={colorIndex} className={`comp-library-color-swatch ${color.borderClass}`} style={{backgroundColor: color.varValue, color:color.textColor}}>
                        <span className="comp-library-color-swatch-name">{color.varName}</span><span className="comp-library-color-swatch-value">{color.varValue}</span>
                    </li>
                </Tooltip>
            )}
            </ul>
        )}
        </div>

    );
};

ColorSwatches.propTypes = {
    scssFileContents: React.PropTypes.string.isRequired
};

export default ColorSwatches;
