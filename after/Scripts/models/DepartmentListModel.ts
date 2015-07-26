/**
 * 部署リストモデルクラス。
 */
class DepartmentListModel extends BaseModel {

    private _departmentModelList: KnockoutObservableArray<DepartmentModel>;

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署リストモデルID
     * @param {DepartmentModel} departmentModelList - 部署モデルリスト
     */
    constructor(id, departmentModelList) {
        super(id);
        this._departmentModelList = <any>observableArray(departmentModelList || []);
    }

    // アクセサ
    get departmentModelList(): KnockoutObservableArray<DepartmentModel> {
        return this._departmentModelList;
    }
    set departmentModelList(value: KnockoutObservableArray<DepartmentModel>) {
        this._departmentModelList = value;
    }

    /**
     * 引数を条件に社員モデルを検索し、結果を返す。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     * @param {string} departmentId - 部署ID
     * @return {EmployeeModel} 社員モデルのリスト
     */
    findEmployeeByArgs(employeeId: string, employeeName: string, departmentId: string): Array<EmployeeModel> {

        var resultList: Array<EmployeeModel> = [];

        var departmentModelList: Array<DepartmentModel> = this.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {

            var departmentModel: DepartmentModel = departmentModelList[i];
            var employeeListModel: EmployeeListModel = departmentModel.employeeListModel();

            var employeeModelList: Array<EmployeeModel> = employeeListModel.employeeModelList();

            for (var j = 0; j < employeeModelList.length; j++) {

                var employeeModel: EmployeeModel = employeeModelList[j];

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
     * 部署IDを条件に部署モデルを検索し、結果を返す。
     * @param {string} departmentId - 部署ID
     * @return {DepartmentModel} 部署モデル
     */
    findDepartmentById(departmentId: string): DepartmentModel {

        var departmentModelList: Array<DepartmentModel> = this.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {

            var departmentModel: DepartmentModel = departmentModelList[i];

            if (departmentId === departmentModel.id()) {
                return departmentModel;
            }
        }

        return null;
    }
}

