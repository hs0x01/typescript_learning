/**
 * 値をko.observable化して返す。
 * 値が既にko.observableであれば、そのまま返す。
 * @param value 値
 * @return {ko.observable}
 */
function observable(value) {

    if (ko.isObservable(value)) {
        return value;
    }
    return ko.observable(value);
}

/**
 * 値をko.observableArray化して返す。
 * 値が既にko.observableArrayであれば、そのまま返す。
 * @param array 配列
 * @return {ko.observableArray}
 */
function observableArray(array) {

    if (!Array.isArray(array)) {
        throw new Error('An argument is not Array.');
    }
    if (ko.isObservable(array)) {
        return array;
    }
    return ko.observableArray(array);
}
