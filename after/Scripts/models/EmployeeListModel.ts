/**
 * 社員リストモデルクラス。
 */
class EmployeeListModel extends BaseModel {

    private _employeeModelList: KnockoutObservableArray<EmployeeModel>;

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員リストモデルID
     * @param {EmployeeModel} employeeModelList - 社員モデルリスト
     */
    constructor (id, employeeModelList) {
        super(id);
        this._employeeModelList = <any>observableArray(employeeModelList || []);
    }

    // アクセサ
    get employeeModelList(): KnockoutObservableArray<EmployeeModel> {
        return this._employeeModelList;
    }
    set employeeModelList(value: KnockoutObservableArray<EmployeeModel>) {
        this._employeeModelList = value;
    }
}
