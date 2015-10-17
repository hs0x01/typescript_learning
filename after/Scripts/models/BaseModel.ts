/**
 * すべてのモデルが共通に継承すべきモデルです。
 */
abstract class BaseModel {
    
    /**
     * オブジェクトIDです。
     * <p>
     * オブジェクトを一意に特定します。
     * </p>
     */
    private _id: KnockoutObservable<string>;

    /**
     * オブジェクトIDを引数にとるコンストラクタです。
     * @param id オブジェクトID
     */
    constructor (id: string) {
        this._id = observable(id || '');
    }

    /**
     * オブジェクトIDを返します。
     * @return オブジェクトID
     */
    get id(): KnockoutObservable<string> {
        return this._id;
    }

    /**
     * オブジェクトIDを設定します。
     * @param value オブジェクトID
     */
    set id(value: KnockoutObservable<string>) {
        this._id = value;
    }
};

