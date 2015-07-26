/**
 * @class 部署モデルクラス。
 */
var DepartmentModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署ID
     * @param {string} name - 部署名
     * @param {EmployeeListModel} employeeListModel - 社員リストモデル
     */
    var self = function (id, name, employeeListModel) {
        
        // メンバ変数の継承
        BaseModel.apply(this, [id]);

        this.name = observable(name || '');
        this.employeeListModel = observable(employeeListModel || null);
    };

    // メソッドの継承
    self.prototype = Object.create(BaseModel.prototype);
    self.prototype.constructor = self;

    /**
     * 当部署に社員を追加する。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     */
    self.prototype.addEmployee = function (employeeId, employeeName) {
        var employeeModel = new EmployeeModel(employeeId, employeeName, this);
        this.employeeListModel().employeeModelList.push(employeeModel);
    };

    /**
     * 当部署から社員を削除する。
     * @param {string} employeeId - 社員ID
     */
    self.prototype.deleteEmployee = function (employeeId) {
        /// <var elementType='EmployeeModel' />
        var employeeModelList = this.employeeListModel().employeeModelList();
        for (var i = 0; i < employeeModelList.length; i++) {
            var employeeModel = employeeModelList[i];
            if (employeeModel.id() === employeeId) {
                // 社員削除
                this.employeeListModel().employeeModelList.splice(i, 1);
            }
        }
    };

    return self;

})();

