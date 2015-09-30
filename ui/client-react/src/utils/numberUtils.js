
class NumberUtils {

    static isInt(val) {
        return (typeof val === 'number' && (val % 1) === 0);
    }
}

export default NumberUtils;