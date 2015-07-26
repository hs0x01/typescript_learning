/**
 * 社員モデルクラス。
 */
var EmployeeModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    var self = function (id, name, departmentModel) {

        /// <field name='departmentModel' type='DepartmentModel' />

        // メンバ変数の継承
        BaseModel.apply(this, [id]);

        this.name = observable(name || '');
        this.departmentModel = observable(departmentModel || null);
    };

    // メソッドの継承
    self.prototype = Object.create(BaseModel.prototype);
    self.prototype.constructor = self;

    /**
     * 社員情報を更新する。
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    self.prototype.updateEmployeeInfo = function (id, name, departmentModel) {

        this.name(name);

        if (this.departmentModel().id() !== departmentModel.id()) {

            /// <var elementType='EmployeeModel' />
            var employeeModelList = this.departmentModel().employeeListModel().employeeModelList;

            for (var i = 0; i < employeeModelList().length; i++) {

                var employeeModel = employeeModelList()[i];

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
    };

    return self;

})();

