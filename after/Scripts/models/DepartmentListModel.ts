/**
 * 部署モデルのリストを扱うモデルです。
 */
class DepartmentListModel extends BaseModel {

    /**
     * 部署モデルのリストです。
     */
    private _departmentModelList: KnockoutObservableArray<DepartmentModel>;

    /**
     * コンストラクタです。
     * @param id 当モデルのID
     * @param departmentModelList 部署モデルのリスト
     */
    constructor(id: string, departmentModelList: Array<DepartmentModel>) {
        super(id);
        this._departmentModelList = observableArray(departmentModelList || []);
    }

    /**
     * 部署モデルのリストを返します。
     * @return 部署モデルのリスト
     */
    get departmentModelList(): KnockoutObservableArray<DepartmentModel> {
        return this._departmentModelList;
    }

    /**
     * 部署モデルのリストを設定します。
     * @param value 部署モデルのリスト
     */
    set departmentModelList(value: KnockoutObservableArray<DepartmentModel>) {
        this._departmentModelList = value;
    }

    /**
     * 引数を条件に社員モデルを検索します。
     * <ul>
     *  <li>引数の値が設定されている場合、その値をAND条件として、検索条件に追加します。</li>
     *  <li>引数の値が<code>null</code>の場合、その値を検索条件に追加しません。</li>
     * </ul>
     *
     * @param employeeId 社員ID
     * @param employeeName 社員名
     * @param departmentId 部署ID
     * @return 社員モデルのリスト。検索結果が0件の場合、空の配列を返します。
     */
    findEmployeeByArgs(employeeId: string, employeeName: string, departmentId: string): Array<EmployeeModel> {
        
        let resultList: Array<EmployeeModel> = [];

        let departmentModelList: Array<DepartmentModel> = this.departmentModelList();

        for (let i = 0; i < departmentModelList.length; i++) {

            let departmentModel: DepartmentModel = departmentModelList[i];
            let employeeListModel: EmployeeListModel = departmentModel.employeeListModel();

            let employeeModelList: Array<EmployeeModel> = employeeListModel.employeeModelList();

            for (let j = 0; j < employeeModelList.length; j++) {

                let employeeModel: EmployeeModel = employeeModelList[j];

                if (employeeId && employeeId !== employeeModel.id()) {
                    continue;
                }
                if (employeeName && employeeModel.name().indexOf(employeeName) < 0) {
                    continue;
                }
                if (departmentId && departmentId !== employeeModel.departmentModel().id()) {
                    continue;
                }

                // 返却する結果リストに追加
                resultList.push(employeeModel);
            }
        }

        return resultList;
    }

    /**
     * 部署IDを条件に部署モデルを検索します。
     * @param departmentId 部署ID
     * @return 部署モデル。検索結果が0件の場合、<code>null</code>を返します。
     */
    findDepartmentById(departmentId: string): DepartmentModel {

        let departmentModelList: Array<DepartmentModel> = this.departmentModelList();

        for (let i = 0; i < departmentModelList.length; i++) {

            let departmentModel: DepartmentModel = departmentModelList[i];

            if (departmentId === departmentModel.id()) {
                return departmentModel;
            }
        }

        return null;
    }
}

