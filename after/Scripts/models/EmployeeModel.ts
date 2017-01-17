/**
 * 社員モデルです。
 */
class EmployeeModel extends BaseModel {

    /**
     * 社員名です。
     */
    private _name: KnockoutObservable<string>;

    /**
     * 所属部署です。
     */
    private _departmentModel: KnockoutObservable<DepartmentModel>;

    /**
     * コンストラクタです。
     * @param id - 社員ID
     * @param name - 社員名
     * @param departmentModel - 所属部署のモデル
     */
    constructor (id: string, name: string, departmentModel: DepartmentModel) {

        super(id);

        this._name = observable(name || '');
        this._departmentModel = observable(departmentModel || null);
    }

    /**
     * 社員名を返します。
     * @return 社員名
     */
    get name(): KnockoutObservable<string> {
        return this._name;
    }

    /**
     * 社員名を設定します。
     * @param value 社員名
     */
    set name(value: KnockoutObservable<string>) {
        this._name = value;
    }

    /**
     * 所属部署を返します。
     * @return 所属部署
     */
    get departmentModel(): KnockoutObservable<DepartmentModel> {
        return this._departmentModel;
    }

    /**
     * 所属部署を設定します。
     * @param value 所属部署
     */
    set departmentModel(value: KnockoutObservable<DepartmentModel>) {
        this._departmentModel = value;
    }

    /**
     * 社員情報を更新します。
     * @param name 社員名
     * @param departmentModel 新しく所属する部署モデル
     */
    updateEmployeeInfo(name: string, departmentModel: DepartmentModel) {

        this.name(name);

        if (this.departmentModel().id() !== departmentModel.id()) {

            let employeeModelList: KnockoutObservableArray<EmployeeModel>
                                        = this.departmentModel().employeeListModel().employeeModelList;

            for (let i = 0; i < employeeModelList().length; i++) {

                let employeeModel: EmployeeModel = employeeModelList()[i];

                if (employeeModel.id() === this.id()) {
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


