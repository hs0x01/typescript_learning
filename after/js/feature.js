/**
 * 社員CRUD機能のビューモデルです。
 */
var EmployeeCrudViewModel = (function () {
    /**
     * コンストラクタです。
     * <p>当ビューモデルを使える状態に初期化します。</p>
     * @param callback 初期化完了で呼び出すコールバック関数
     */
    function EmployeeCrudViewModel(callback) {
        /**
         * 更新条件となる社員IDです。
         */
        this._employeeId = observable('');
        /**
         * 更新条件となる社員名です。
         */
        this._employeeName = observable('');
        /**
         * 更新条件となる部署です。
         */
        this._department = observable(null);
        /**
         * 検索条件となる社員IDです。
         */
        this._employeeIdFind = observable('');
        /**
         * 検索条件となる社員名です。
         */
        this._employeeNameFind = observable('');
        /**
         * 検索条件となる部署です。
         */
        this._departmentFind = observable(null);
        /**
         * 部署リストモデルです。
         */
        this._departmentListModel = observable(null);
        /**
         * 社員リストビューモデルです。
         */
        this._employeeListViewModel = new EmployeeListViewModel();
        /**
         * 入力値をリセットします。
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
        /**
         * 更新条件となる社員IDを返します。
         * @return 更新条件となる社員ID
         */
        get: function () {
            return this._employeeId;
        },
        /**
         * 更新条件となる社員IDを設定します。
         * @param value 更新条件となる社員ID
         */
        set: function (value) {
            this._employeeId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeName", {
        /**
         * 更新条件となる社員名を返します。
         * @return 更新条件となる社員名
         */
        get: function () {
            return this._employeeName;
        },
        /**
         * 更新条件となる社員名を設定します。
         * @param value 更新条件となる社員名
         */
        set: function (value) {
            this._employeeName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "department", {
        /**
         * 更新条件となる部署を返します。
         * @return 更新条件となる部署
         */
        get: function () {
            return this._department;
        },
        /**
         * 更新条件となる部署を設定します。
         * @param value 更新条件となる部署
         */
        set: function (value) {
            this._department = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeIdFind", {
        /**
         * 検索条件となる社員IDを返します。
         * @return 検索条件となる社員ID
         */
        get: function () {
            return this._employeeIdFind;
        },
        /**
         * 検索条件となる社員IDを設定します。
         * @param value 検索条件となる社員ID
         */
        set: function (value) {
            this._employeeIdFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeNameFind", {
        /**
         * 検索条件となる社員名を返します。
         * @return 検索条件となる社員名
         */
        get: function () {
            return this._employeeNameFind;
        },
        /**
         * 検索条件となる社員名を設定します。
         * @param value 検索条件となる社員名
         */
        set: function (value) {
            this._employeeNameFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "departmentFind", {
        /**
         * 検索条件となる部署を返します。
         * @return 検索条件となる部署
         */
        get: function () {
            return this._departmentFind;
        },
        /**
         * 検索条件となる部署を設定します。
         * @param value 検索条件となる部署
         */
        set: function (value) {
            this._departmentFind = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "departmentListModel", {
        /**
         * 部署リストモデルを返します。
         * @return 部署リストモデル
         */
        get: function () {
            return this._departmentListModel;
        },
        /**
         * 部署リストモデルを設定します。
         * @param value 部署リストモデル
         */
        set: function (value) {
            this._departmentListModel = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeCrudViewModel.prototype, "employeeListViewModel", {
        /**
         * 社員リストモデルを返します。
         * @return 社員リストモデル
         */
        get: function () {
            return this._employeeListViewModel;
        },
        /**
         * 社員リストモデルを設定します。
         * @param value 社員リストモデル
         */
        set: function (value) {
            this._employeeListViewModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * メンバ変数の検索条件により、社員を検索します。
     * <p>結果は、社員リストビューモデルを更新することで通知します。</p>
     */
    EmployeeCrudViewModel.prototype.findEmployee = function () {
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeIdFind(), this.employeeNameFind(), !this.departmentFind() ? null : this.departmentFind().id());
        var employeeModelList = this.employeeListViewModel.employeeListModel().employeeModelList;
        employeeModelList(employeeList);
    };
    /**
     * 社員を選択します。
     */
    EmployeeCrudViewModel.prototype.selectEmployee = function () {
        var selectedEmployee = this.employeeListViewModel.getSelectedEmployee();
        this.employeeId(selectedEmployee.id());
        this.employeeName(selectedEmployee.name());
        this.department(selectedEmployee.departmentModel());
    };
    /**
     * 部署に社員を追加可能か判定し、結果を返します。
     * @return 追加可能であれば<code>true</code>、そうでなければ<code>false</code>
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
     * 社員情報を更新可能か判定し、結果を返します。
     * @return 更新可能であれば<code>true</code>、そうでなければ<code>false</code>
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
     * 部署から社員を削除可能か判定し、結果を返します。
     * @return 削除可能であれば<code>true</code>、そうでなければ<code>false</code>
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
     * 部署に社員を追加します。
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
     * 社員情報を更新します。
     */
    EmployeeCrudViewModel.prototype.updateEmployee = function () {
        if (!this.canUpdateEmployee()) {
            return;
        }
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        var employeeModel = employeeList[0];
        // 更新
        employeeModel.updateEmployeeInfo(this.employeeName(), this.department());
        // 入力値をリセット
        this.resetInput();
        // 再検索
        this.findEmployee();
    };
    /**
     * 部署から社員を削除します。
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
     * すべての部署と所属する社員を保存します。
     */
    EmployeeCrudViewModel.prototype.saveDepartmentAll = function () {
        DepartmentRepository.saveDepartmentAll(this.departmentListModel(), function () {
        });
    };
    return EmployeeCrudViewModel;
})();
/**
 * 社員リストのビューモデルです。
 */
var EmployeeListViewModel = (function () {
    /**
     * コンストラクタです。
     */
    function EmployeeListViewModel() {
        this._selectedRowIdx = observable(0);
        this._employeeListModel = observable(new EmployeeListModel(GuidUtil.createGuid(), []));
    }
    Object.defineProperty(EmployeeListViewModel.prototype, "selectedRowIdx", {
        /**
         * 選択された行のインデックスを返します。
         * @return 選択された行のインデックス
         */
        get: function () {
            return this._selectedRowIdx;
        },
        /**
         * 選択された行のインデックスを設定します。
         * @param value 選択された行のインデックス
         */
        set: function (value) {
            this._selectedRowIdx = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeListViewModel.prototype, "employeeListModel", {
        /**
         * 社員リストモデルを返します。
         * @return 社員リストモデル
         */
        get: function () {
            return this._employeeListModel;
        },
        /**
         * 社員リストモデルを設定します。
         * @param value 社員リストモデル
         */
        set: function (value) {
            this._employeeListModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 選択された社員を返します。
     * @return 選択された社員。存在しない場合、<code>null</code>を返します。
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
