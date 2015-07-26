/**
 * 部署リストモデルクラス。
 */
var DepartmentListModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署リストモデルID
     * @param {DepartmentModel} departmentModelList - 部署モデルリスト
     */
    var self = function (id, departmentModelList) {

        // メンバ変数の継承
        BaseModel.apply(this, [id]);

        this.departmentModelList = observableArray(departmentModelList || []);
    };

    // メソッドの継承
    self.prototype = Object.create(BaseModel.prototype);
    self.prototype.constructor = self;

    /**
     * 引数を条件に社員モデルを検索し、結果を返す。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     * @param {string} departmentId - 部署ID
     * @return {EmployeeModel} 社員モデルのリスト
     */
    self.prototype.findEmployeeByArgs = function (employeeId, employeeName, departmentId) {

        var resultList = [];

        /// <var elementType='DepartmentModel' />
        var departmentModelList = this.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {

            var departmentModel = departmentModelList[i];
            var employeeListModel = departmentModel.employeeListModel();

            /// <var elementType='EmployeeModel' />
            var employeeModelList = employeeListModel.employeeModelList();

            for (var j = 0; j < employeeModelList.length; j++) {

                var employeeModel = employeeModelList[j];

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
    };

    /**
     * 部署IDを条件に部署モデルを検索し、結果を返す。
     * @param {string} departmentId - 部署ID
     * @return {DepartmentModel} 部署モデル
     */
    self.prototype.findDepartmentById = function (departmentId) {

        /// <var elementType='DepartmentModel' />
        var departmentModelList = this.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {

            var departmentModel = departmentModelList[i];

            if (departmentId === departmentModel.id()) {
                return departmentModel;
            }
        }

        return null;
    };

    return self;

})();

