/**
 * 社員CRUD機能のビューモデルクラス。
 */
var EmployeeCrudViewModel = (function () {
    /**
     * コンストラクタ。
     * @constructor
     * @param {function} callback - コールバック関数
     */
    function EmployeeCrudViewModel(callback) {
        /**
         * 社員ID-更新系。
         * @return {string}
         */
        this._employeeId = observable('');
        /**
         * 社員名-更新系。
         * @return {string}
         */
        this._employeeName = observable('');
        /**
         * 部署-更新系。
         * @return {DepartmentModel}
         */
        this._department = observable(null);
        /**
         * 社員ID-検索。
         * @return {string}
         */
        this._employeeIdFind = observable('');
        /**
         * 社員名-検索。
         * @return {string}
         */
        this._employeeNameFind = observable('');
        /**
         * 部署-検索。
         * @return {DepartmentModel}
         */
        this._departmentFind = observable(null);
        /**
         * 部署リストモデル。
         * @return {DepartmentListModel}
         */
        this._departmentListModel = observable(null);
        /**
         * 社員リストビューモデル。
         * @return {EmployeeListViewModel}
         */
        this._employeeListViewModel = new EmployeeListViewModel();
        /**
         * 入力値をリセットする。
         */
        this.resetInput = function () {
            this.employeeId('');
            this.employeeName('');
            this.department(null);
            this.employeeIdFind('');
            this.employeeNameFind('');
            this.departmentFind(null);
        };
        var thisViewModel = this;
        // 変更があったときにfindEmployeeメソッドを実行するように設定
        this._employeeIdFind.subscribe(function () {
            thisViewModel.findEmployee();
        });
        this._employeeNameFind.subscribe(function () {
            thisViewModel.findEmployee();
        });
        this._departmentFind.subscribe(function () {
            thisViewModel.findEmployee();
        });
        // すべての部署と社員を取得
        DepartmentRepository.findDepartmentAll(function (departmentListModel) {
            thisViewModel._departmentListModel(departmentListModel);
            // 初期化完了によりコールバック
            callback(thisViewModel);
        });
    }
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeId", {
        // アクセサ
        get: function () {
            return this._employeeId;
        },
        set: function (value) {
            this._employeeId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeName", {
        get: function () {
            return this._employeeName;
        },
        set: function (value) {
            this._employeeName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "department", {
        get: function () {
            return this._department;
        },
        set: function (value) {
            this._department = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeIdFind", {
        get: function () {
            return this._employeeIdFind;
        },
        set: function (value) {
            this._employeeIdFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeNameFind", {
        get: function () {
            return this._employeeNameFind;
        },
        set: function (value) {
            this._employeeNameFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "departmentFind", {
        get: function () {
            return this._departmentFind;
        },
        set: function (value) {
            this._departmentFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "departmentListModel", {
        get: function () {
            return this._departmentListModel;
        },
        set: function (value) {
            this._departmentListModel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeListViewModel", {
        get: function () {
            return this._employeeListViewModel;
        },
        set: function (value) {
            this._employeeListViewModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * メンバ変数の検索条件により、社員を検索する。
     * 結果は、社員リストビューモデルを更新することで通知する。
     */
    EmployeeCrudViewModel.prototype.findEmployee = function () {
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeIdFind(), this.employeeNameFind(), !this.departmentFind() ? null : this.departmentFind().id());
        var employeeModelList = this.employeeListViewModel.employeeListModel().employeeModelList;
        employeeModelList(employeeList);
    };
    /**
     * 社員を選択する。
     */
    EmployeeCrudViewModel.prototype.selectEmployee = function () {
        var selectedEmployee = this.employeeListViewModel.getSelectedEmployee();
        this.employeeId(selectedEmployee.id());
        this.employeeName(selectedEmployee.name());
        this.department(selectedEmployee.departmentModel());
    };
    /**
     * 部署に社員を追加可能か判定し、結果を返す。
     * return {boolean}
     */
    EmployeeCrudViewModel.prototype.canAddEmployee = function () {
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
    EmployeeCrudViewModel.prototype.canUpdateEmployee = function () {
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
    EmployeeCrudViewModel.prototype.canDeleteEmployee = function () {
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
    EmployeeCrudViewModel.prototype.addEmployee = function () {
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
    EmployeeCrudViewModel.prototype.updateEmployee = function () {
        if (!this.canUpdateEmployee()) {
            return;
        }
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
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
    EmployeeCrudViewModel.prototype.deleteEmployee = function () {
        if (!this.canDeleteEmployee()) {
            return;
        }
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
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
    EmployeeCrudViewModel.prototype.saveDepartmentAll = function () {
        DepartmentRepository.saveDepartmentAll(this.departmentListModel(), function () {
        });
    };
    return EmployeeCrudViewModel;
})();
/**
 * 社員リストのビューモデルクラス。
 */
var EmployeeListViewModel = (function () {
    /**
     * コンストラクタ。
     * @constructor
     */
    function EmployeeListViewModel() {
        /**
         * 選択行のインデックス番号。
         * @return {number}
         */
        this._selectedRowIdx = observable(0);
        /**
         * 社員リストモデル。
         * @return {EmployeeListModel}
         */
        this._employeeListModel = observable(new EmployeeListModel(GuidUtil.createGuid(), []));
    }
    Object.defineProperty(EmployeeListViewModel.prototype, "selectedRowIdx", {
        // アクセサ
        get: function () {
            return this._selectedRowIdx;
        },
        set: function (value) {
            this._selectedRowIdx = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeListViewModel.prototype, "employeeListModel", {
        get: function () {
            return this._employeeListModel;
        },
        set: function (value) {
            this._employeeListModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 選択された社員を返す。
     * @return {EmployeeModel}
     */
    EmployeeListViewModel.prototype.getSelectedEmployee = function () {
        var employeeListModel = this.employeeListModel();
        var employeeModelList = employeeListModel.employeeModelList();
        var employee = null;
        if (this.selectedRowIdx() >= 0 && this.selectedRowIdx() < employeeModelList.length) {
            employee = employeeListModel.employeeModelList()[this.selectedRowIdx()];
        }
        return employee;
    };
    return EmployeeListViewModel;
})();
