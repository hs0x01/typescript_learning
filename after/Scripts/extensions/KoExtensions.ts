/**
 * 値を<code>ko.observable</code>化して返します。
 * <p>
 * 値が既に<code>ko.observable</code>であれば、それを返します。
 * </p>
 * @param value 値
 * @return <code>ko.observable</code>な値
 */
function observable<T>(value: T): KnockoutObservable<T> {

    if (ko.isObservable(value)) {
        return <any>value;
    }

    return ko.observable(value);
}

/**
 * 値を<code>ko.observableArray</code>化して返します。
 * <p>
 * 値が既に<code>ko.observableArray</code>であれば、それを返します。
 * </p>
 * @param array 配列
 * @return <code>ko.observableArray</code>な値
 */
function observableArray<T>(array: Array<T>): KnockoutObservableArray<T> {

    if (!Array.isArray(array)) {
        throw new Error('An argument is not Array.');
    }
    if (ko.isObservable(array)) {
        return <any>array;
    }
    return ko.observableArray(array);
}
