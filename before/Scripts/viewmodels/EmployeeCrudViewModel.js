/**
 * 社員CRUD機能のビューモデルクラス。
 */
var EmployeeCrudViewModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {function} callback - コールバック関数
     */
    var self = function (callback) {

        /**
         * 社員ID-更新系。
         * @return {string}
         */
        this.employeeId = observable('');

        /**
         * 社員名-更新系。
         * @return {string}
         */
        this.employeeName = observable('');

        /**
         * 部署-更新系。
         * @return {DepartmentModel}
         */
        this.department = observable(null);

        /**
         * 社員ID-検索。
         * @return {string}
         */
        this.employeeIdFind = observable('');

        /**
         * 社員名-検索。
         * @return {string}
         */
        this.employeeNameFind = observable('');

        /**
         * 部署-検索。
         * @return {DepartmentModel}
         */
        this.departmentFind = observable(null);

        /**
         * 部署リストモデル。
         * @return {DepartmentListModel}
         */
        this.departmentListModel = observable(null);

        /**
         * 社員リストビューモデル。
         * @return {EmployeeListViewModel}
         */
        this.employeeListViewModel = new EmployeeListViewModel();

        var thisViewModel = this;

        // 変更があったときにfindEmployeeメソッドを実行するように設定
        this.employeeIdFind.subscribe(function () {
            thisViewModel.findEmployee();
        });
        this.employeeNameFind.subscribe(function () {
            thisViewModel.findEmployee();
        });
        this.departmentFind.subscribe(function () {
            thisViewModel.findEmployee();
        });

        // すべての部署と社員を取得
        DepartmentRepository.findDepartmentAll(function (departmentListModel) {

            thisViewModel.departmentListModel(departmentListModel);

            // 初期化完了によりコールバック
            callback(thisViewModel);
        });
    };

    /**
     * メンバ変数の検索条件により、社員を検索する。
     * 結果は、社員リストビューモデルを更新することで通知する。
     */
    self.prototype.findEmployee = function () {

        var employeeList = this.departmentListModel().findEmployeeByArgs(
                                            this.employeeIdFind(),
                                            this.employeeNameFind(),
                                            !this.departmentFind() ? null : this.departmentFind().id());

        var employeeModelList = this.employeeListViewModel.employeeListModel().employeeModelList;

        employeeModelList(employeeList);
    };

    /**
     * 社員を選択する。
     */
    self.prototype.selectEmployee = function () {
        var selectedEmployee = this.employeeListViewModel.getSelectedEmployee();
        this.employeeId(selectedEmployee.id());
        this.employeeName(selectedEmployee.name());
        this.department(selectedEmployee.departmentModel());
    };

    /**
     * 部署に社員を追加可能か判定し、結果を返す。
     * return {boolean}
     */
    self.prototype.canAddEmployee = function () {

        if (!this.employeeId()) {
            return false;
        }
        if (!this.employeeName()) {
            return false;
        }
        if (!this.department() || !this.department().id()) {
            return false;
        }

        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length > 0) {
            return false;
        }

        return true;
    };

    /**
     * 社員情報を更新可能か判定し、結果を返す。
     * return {boolean}
     */
    self.prototype.canUpdateEmployee = function () {

        if (!this.employeeId()) {
            return false;
        }
        if (!this.employeeName()) {
            return false;
        }
        if (!this.department() || !this.department().id()) {
            return false;
        }

        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    };

    /**
     * 部署から社員を削除可能か判定し、結果を返す。
     * return {boolean}
     */
    self.prototype.canDeleteEmployee = function () {

        if (!this.employeeId()) {
            return false;
        }
        
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    };

    /**
     * 部署に社員を追加する。
     */
    self.prototype.addEmployee = function () {

        if (!this.canAddEmployee()) {
            return;
        }

        var departmentModel = this.departmentListModel().findDepartmentById(this.department().id());

        // 追加
        departmentModel.addEmployee(this.employeeId(), this.employeeName());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    };

    /**
     * 社員情報を更新する。
     */
    self.prototype.updateEmployee = function () {

        if (!this.canUpdateEmployee()) {
            return;
        }

        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        /// <var type='EmployeeModel' />
        var employeeModel = employeeList[0];

        // 更新
        employeeModel.updateEmployeeInfo(this.employeeId(), this.employeeName(), this.department());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    };

    /**
     * 部署から社員を削除する。
     */
    self.prototype.deleteEmployee = function () {

        if (!this.canDeleteEmployee()) {
            return;
        }

        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        /// <var type='EmployeeModel' />
        var employeeModel = employeeList[0];

        // 削除
        employeeModel.departmentModel().deleteEmployee(this.employeeId());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    };

    /**
     * すべての部署と所属する社員を保存する。
     */
    self.prototype.saveDepartmentAll = function () {
        DepartmentRepository.saveDepartmentAll(this.departmentListModel(), function () {
        })
    };

    /**
     * 入力値をリセットする。
     */
    self.prototype.resetInput = function () {
        this.employeeId('');
        this.employeeName('');
        this.department(null);
        this.employeeIdFind('');
        this.employeeNameFind('');
        this.departmentFind(null);
    };

    return self;

})();

