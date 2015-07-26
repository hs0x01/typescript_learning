/**
 * 基底モデルクラス。
 */
class BaseModel {
    
    private _id: KnockoutObservable<string>;

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - ID
     */
    constructor (id: string) {
        this._id = observable(id || '');
    }

    // アクセサ
    get id(): KnockoutObservable<string> {
        return this._id;
    }
    set id(value: KnockoutObservable<string>) {
        this._id = value;
    }
};

