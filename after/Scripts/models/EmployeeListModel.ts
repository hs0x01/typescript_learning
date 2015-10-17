/**
 * 社員モデルのリストを扱うモデルです。
 */
class EmployeeListModel extends BaseModel {

    /**
     * 社員モデルのリストです。
     */
    private _employeeModelList: KnockoutObservableArray<EmployeeModel>;

    /**
     * コンストラクタです。
     * @param id 社員リストモデルID
     * @param employeeModelList 社員モデルリスト
     */
    constructor (id: string, employeeModelList: Array<EmployeeModel>) {
        super(id);
        this._employeeModelList = <any>observableArray(employeeModelList || []);
    }

    /**
     * 社員モデルリストを返します。
     * @return 社員モデルリスト
     */
    get employeeModelList(): KnockoutObservableArray<EmployeeModel> {
        return this._employeeModelList;
    }

    /**
     * 社員モデルリストを設定します。
     * @param value 社員モデルリスト
     */
    set employeeModelList(value: KnockoutObservableArray<EmployeeModel>) {
        this._employeeModelList = value;
    }
}
