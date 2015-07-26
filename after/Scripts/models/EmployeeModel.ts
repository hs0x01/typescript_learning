/**
 * 社員モデルクラス。
 */
class EmployeeModel extends BaseModel {

    private _name: KnockoutObservable<string>;
    private _departmentModel: KnockoutObservable<DepartmentModel>;

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    constructor (id: string, name: string, departmentModel: DepartmentModel) {

        super(id);

        this._name = observable(name || '');
        this._departmentModel = observable(departmentModel || null);
    }

    // アクセサ
    get name(): KnockoutObservable<string> {
        return this._name;
    }
    set name(value: KnockoutObservable<string>) {
        this._name = value;
    }
    get departmentModel(): KnockoutObservable<DepartmentModel> {
        return this._departmentModel;
    }
    set departmentModel(value: KnockoutObservable<DepartmentModel>) {
        this._departmentModel = value;
    }

    /**
     * 社員情報を更新する。
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    updateEmployeeInfo(id: string, name: string, departmentModel: DepartmentModel) {

        this.name(name);

        if (this.departmentModel().id() !== departmentModel.id()) {

            var employeeModelList: KnockoutObservableArray<EmployeeModel>
                                        = this.departmentModel().employeeListModel().employeeModelList;

            for (var i = 0; i < employeeModelList().length; i++) {

                var employeeModel: EmployeeModel = employeeModelList()[i];

                if (employeeModel.id() === id) {
                    // 元の部署から社員を削除
                    employeeModelList().splice(i, 1);
                    break;
                }
            }

            // 新規部署に社員を追加
            departmentModel.employeeListModel().employeeModelList.push(this);

            // 社員の部署を新規に更新
            this.departmentModel(departmentModel);
        }
    }
};


