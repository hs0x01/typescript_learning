/**
 * 部署モデルです。
 */
class DepartmentModel extends BaseModel {

    /**
     * 部署名です。
     */
    private _name: KnockoutObservable<string>;

    /**
     * 社員リストモデルです。
     */
    private _employeeListModel: KnockoutObservable<EmployeeListModel>;

    /**
     * コンストラクタです。
     * @param id 部署のID
     * @param name 部署名
     * @param employeeListModel 社員リストモデル
     */
    constructor (id: string, name: string, employeeListModel: EmployeeListModel) {
        super(id);
        this._name = observable(name || '');
        this._employeeListModel = observable(employeeListModel || null);
    }

    /**
     * 部署名を返します。
     * @return 部署名
     */
    get name(): KnockoutObservable<string> {
        return this._name;
    }

    /**
     * 部署名を設定します。
     * @param value 部署名
     */
    set name(value: KnockoutObservable<string>) {
        this._name = value;
    }

    /**
     * 社員リストモデルを返します。
     * @return 社員リストモデル
     */
    get employeeListModel(): KnockoutObservable<EmployeeListModel> {
        return this._employeeListModel;
    }

    /**
     * 社員リストモデルを設定します。
     * @param value 社員リストモデル
     */
    set employeeListModel(value: KnockoutObservable<EmployeeListModel>) {
        this._employeeListModel = value;
    }

    /**
     * 当部署に社員を追加します。
     * @param employeeId 社員ID
     * @param employeeName 社員名
     */
    addEmployee(employeeId: string, employeeName: string) {
        var employeeModel: EmployeeModel = new EmployeeModel(employeeId, employeeName, this);
        this.employeeListModel().employeeModelList.push(employeeModel);
    }

    /**
     * 当部署から社員を削除します。
     * @param employeeId 社員ID
     */
    deleteEmployee(employeeId: string) {
        var employeeModelList: Array<EmployeeModel> = this.employeeListModel().employeeModelList();
        for (var i = 0; i < employeeModelList.length; i++) {
            var employeeModel: EmployeeModel = employeeModelList[i];
            if (employeeModel.id() === employeeId) {
                // 社員削除
                this.employeeListModel().employeeModelList.splice(i, 1);
            }
        }
    }
}

