/**
 * Interface class to describe a transform to be performed
 * on a set of React Tabular column definition
 */
class ColumnTransform {
    /**
     * Constructor
     * @param grid - a reference to the StandardGrid
     * @param props - additional properties for this class
     */
    constructor(grid, props) {
        this.grid = grid;
        this.props = props;
    }

    /**
     * Should apply whatever transform is desired to the column
     *
     * @param column - the original array of columns
     * @returns a new column definitions transformed as desired
     */
    apply = (columns) => {
        return columns;
    };
}

export default ColumnTransform;
