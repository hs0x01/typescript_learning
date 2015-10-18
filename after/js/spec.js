/**
 * 値を<code>ko.observable</code>化して返します。
 * <p>
 * 値が既に<code>ko.observable</code>であれば、それを返します。
 * </p>
 * @param value 値
 * @return <code>ko.observable</code>な値
 */
function observable(value) {
    if (ko.isObservable(value)) {
        return value;
    }
    return ko.observable(value);
}
/**
 * 値を<code>ko.observableArray</code>化して返します。
 * <p>
 * 値が既に<code>ko.observableArray</code>であれば、それを返します。
 * </p>
 * @param array 配列
 * @return <code>ko.observableArray</code>な値
 */
function observableArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('An argument is not Array.');
    }
    if (ko.isObservable(array)) {
        return array;
    }
    return ko.observableArray(array);
}
/**
 * すべてのモデルが共通に継承すべきモデルです。
 */
var BaseModel = (function () {
    /**
     * オブジェクトIDを引数にとるコンストラクタです。
     * @param id オブジェクトID
     */
    function BaseModel(id) {
        this._id = observable(id || '');
    }
    Object.defineProperty(BaseModel.prototype, "id", {
        /**
         * オブジェクトIDを返します。
         * @return オブジェクトID
         */
        get: function () {
            return this._id;
        },
        /**
         * オブジェクトIDを設定します。
         * @param value オブジェクトID
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    return BaseModel;
})();
;
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 部署モデルのリストを扱うモデルです。
 */
var DepartmentListModel = (function (_super) {
    __extends(DepartmentListModel, _super);
    /**
     * コンストラクタです。
     * @param id 当モデルのID
     * @param departmentModelList 部署モデルのリスト
     */
    function DepartmentListModel(id, departmentModelList) {
        _super.call(this, id);
        this._departmentModelList = observableArray(departmentModelList || []);
    }
    Object.defineProperty(DepartmentListModel.prototype, "departmentModelList", {
        /**
         * 部署モデルのリストを返します。
         * @return 部署モデルのリスト
         */
        get: function () {
            return this._departmentModelList;
        },
        /**
         * 部署モデルのリストを設定します。
         * @param value 部署モデルのリスト
         */
        set: function (value) {
            this._departmentModelList = value;
        },
        enumerable: true,
        configurable: true
    });
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
    DepartmentListModel.prototype.findEmployeeByArgs = function (employeeId, employeeName, departmentId) {
        var resultList = [];
        var departmentModelList = this.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            var employeeListModel = departmentModel.employeeListModel();
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
     * 部署IDを条件に部署モデルを検索します。
     * @param departmentId 部署ID
     * @return 部署モデル。検索結果が0件の場合、<code>null</code>を返します。
     */
    DepartmentListModel.prototype.findDepartmentById = function (departmentId) {
        var departmentModelList = this.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            if (departmentId === departmentModel.id()) {
                return departmentModel;
            }
        }
        return null;
    };
    return DepartmentListModel;
})(BaseModel);
/**
 * 部署モデルです。
 */
var DepartmentModel = (function (_super) {
    __extends(DepartmentModel, _super);
    /**
     * コンストラクタです。
     * @param id 部署のID
     * @param name 部署名
     * @param employeeListModel 社員リストモデル
     */
    function DepartmentModel(id, name, employeeListModel) {
        _super.call(this, id);
        this._name = observable(name || '');
        this._employeeListModel = observable(employeeListModel || null);
    }
    Object.defineProperty(DepartmentModel.prototype, "name", {
        /**
         * 部署名を返します。
         * @return 部署名
         */
        get: function () {
            return this._name;
        },
        /**
         * 部署名を設定します。
         * @param value 部署名
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DepartmentModel.prototype, "employeeListModel", {
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
     * 当部署に社員を追加します。
     * @param employeeId 社員ID
     * @param employeeName 社員名
     */
    DepartmentModel.prototype.addEmployee = function (employeeId, employeeName) {
        var employeeModel = new EmployeeModel(employeeId, employeeName, this);
        this.employeeListModel().employeeModelList.push(employeeModel);
    };
    /**
     * 当部署から社員を削除します。
     * @param employeeId 社員ID
     */
    DepartmentModel.prototype.deleteEmployee = function (employeeId) {
        var employeeModelList = this.employeeListModel().employeeModelList();
        for (var i = 0; i < employeeModelList.length; i++) {
            var employeeModel = employeeModelList[i];
            if (employeeModel.id() === employeeId) {
                // 社員削除
                this.employeeListModel().employeeModelList.splice(i, 1);
            }
        }
    };
    return DepartmentModel;
})(BaseModel);
/**
 * 社員モデルのリストを扱うモデルです。
 */
var EmployeeListModel = (function (_super) {
    __extends(EmployeeListModel, _super);
    /**
     * コンストラクタです。
     * @param id 社員リストモデルID
     * @param employeeModelList 社員モデルリスト
     */
    function EmployeeListModel(id, employeeModelList) {
        _super.call(this, id);
        this._employeeModelList = observableArray(employeeModelList || []);
    }
    Object.defineProperty(EmployeeListModel.prototype, "employeeModelList", {
        /**
         * 社員モデルリストを返します。
         * @return 社員モデルリスト
         */
        get: function () {
            return this._employeeModelList;
        },
        /**
         * 社員モデルリストを設定します。
         * @param value 社員モデルリスト
         */
        set: function (value) {
            this._employeeModelList = value;
        },
        enumerable: true,
        configurable: true
    });
    return EmployeeListModel;
})(BaseModel);
/**
 * 社員モデルです。
 */
var EmployeeModel = (function (_super) {
    __extends(EmployeeModel, _super);
    /**
     * コンストラクタです。
     * @param id - 社員ID
     * @param name - 社員名
     * @param departmentModel - 所属部署のモデル
     */
    function EmployeeModel(id, name, departmentModel) {
        _super.call(this, id);
        this._name = observable(name || '');
        this._departmentModel = observable(departmentModel || null);
    }
    Object.defineProperty(EmployeeModel.prototype, "name", {
        /**
         * 社員名を返します。
         * @return 社員名
         */
        get: function () {
            return this._name;
        },
        /**
         * 社員名を設定します。
         * @param value 社員名
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeModel.prototype, "departmentModel", {
        /**
         * 所属部署を返します。
         * @return 所属部署
         */
        get: function () {
            return this._departmentModel;
        },
        /**
         * 所属部署を設定します。
         * @param value 所属部署
         */
        set: function (value) {
            this._departmentModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 社員情報を更新します。
     * @param name 社員名
     * @param departmentModel 新しく所属する部署モデル
     */
    EmployeeModel.prototype.updateEmployeeInfo = function (name, departmentModel) {
        this.name(name);
        if (this.departmentModel().id() !== departmentModel.id()) {
            var employeeModelList = this.departmentModel().employeeListModel().employeeModelList;
            for (var i = 0; i < employeeModelList().length; i++) {
                var employeeModel = employeeModelList()[i];
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
    };
    return EmployeeModel;
})(BaseModel);
;
/**
 * 部署モデルのリポジトリです。
 */
var DepartmentRepository = (function () {
    function DepartmentRepository() {
    }
    /**
     * すべての部署モデルを返します。
     * <p>
     * すべての部署モデル(<code>DepartmentListModel</code>)は、コールバック関数の引数として返します。
     * </p>
     * @param callback コールバック関数
     */
    DepartmentRepository.findDepartmentAll = function (callback) {
        var departmentListModel = null;
        var item = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        if (item === null) {
            departmentListModel = this.createDepartmentListModelFromDefault();
        }
        else {
            departmentListModel = this.createDepartmentListModelFromXml(item);
        }
        // サーバーへのAjax通信を想定してコールバック
        callback(departmentListModel);
    };
    /**
     * すべての部署モデルを保存します。
     * <p>現在、ローカルストレージに保存しています。</p>
     * <p>保存完了は、コールバック関数を呼び出すことにより通知します。</p>
     * @param departmentListModel 部署リストモデル
     * @param callback コールバック関数
     */
    DepartmentRepository.saveDepartmentAll = function (departmentListModel, callback) {
        var xml = this.createDepartmentListModelXml(departmentListModel);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);
        // サーバーへのAjax通信を想定してコールバック
        callback();
    };
    /**
     * 部署リストモデルのXMLデータを生成します。
     * @param departmentListModel 部署リストモデル
     * @return 部署リストモデルのXMLデータ
     */
    DepartmentRepository.createDepartmentListModelXml = function (departmentListModel) {
        var xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';
        var departmentModelList = departmentListModel.departmentModelList();
        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];
            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';
            var employeeListModel = departmentModel.employeeListModel();
            xml += '            <id>' + employeeListModel.id() + '</id>';
            var employeeModelList = employeeListModel.employeeModelList();
            for (var j = 0; j < employeeModelList.length; j++) {
                var employeeModel = employeeModelList[j];
                xml += '        <employeeModel>';
                xml += '            <id>' + employeeModel.id() + '</id>';
                xml += '            <name>' + employeeModel.name() + '</name>';
                xml += '        </employeeModel>';
            }
            xml += '        </employeeListModel>';
            xml += '    </departmentModel>';
        }
        xml += '    </departmentListModel>';
        return xml;
    };
    /**
     * 部署リストモデルをデフォルト値から生成します。
     * @return 部署モデルリスト
     */
    DepartmentRepository.createDepartmentListModelFromDefault = function () {
        var empInDev = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInSales = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInGeneral = new EmployeeListModel(GuidUtil.createGuid(), []);
        var devDeptModel = new DepartmentModel(GuidUtil.createGuid(), '開発部', empInDev);
        var salesDeptModel = new DepartmentModel(GuidUtil.createGuid(), '営業部', empInSales);
        var generalDeptModel = new DepartmentModel(GuidUtil.createGuid(), '総務部', empInGeneral);
        var departmentModelList = [];
        departmentModelList.push(devDeptModel);
        departmentModelList.push(salesDeptModel);
        departmentModelList.push(generalDeptModel);
        var departmentListModel = new DepartmentListModel(GuidUtil.createGuid(), departmentModelList);
        return departmentListModel;
    };
    /**
     * 部署リストモデルをXMLから生成します。
     * @param xml XML
     * @return 部署リストモデル
     */
    DepartmentRepository.createDepartmentListModelFromXml = function (xml) {
        var $xml = $($.parseXML(xml));
        var $departmentListModelXml = $xml.find('departmentListModel');
        var departmentListModelId = $departmentListModelXml.children('id').text();
        // 部署リストモデル
        var departmentListModel = new DepartmentListModel(departmentListModelId, []);
        var $departmentModelXml = $departmentListModelXml.find('departmentModel');
        $departmentModelXml.each(function () {
            var $deptXml = $(this);
            var departmentId = $deptXml.children('id').text();
            var departmentName = $deptXml.children('name').text();
            var $employeeListModelXml = $deptXml.find('employeeListModel');
            var employeeListModelId = $employeeListModelXml.children('id').text();
            // 部署モデル
            var departmentModel = new DepartmentModel(departmentId, departmentName, new EmployeeListModel(employeeListModelId, []));
            // 部署リストに部署を追加
            departmentListModel.departmentModelList.push(departmentModel);
            var $employeeModelXml = $employeeListModelXml.find('employeeModel');
            $employeeModelXml.each(function () {
                var $empXml = $(this);
                var employeeId = $empXml.children('id').text();
                var employeeName = $empXml.children('name').text();
                // 部署に社員を追加
                departmentModel.addEmployee(employeeId, employeeName);
            });
        });
        return departmentListModel;
    };
    /**
     * ローカルストレージキーです。
     */
    DepartmentRepository.LOCAL_STORAGE_KEY = 'sample.all-department-model';
    return DepartmentRepository;
})();
/**
 * GUIDのユーティリティです。
 */
var GuidUtil = (function () {
    function GuidUtil() {
    }
    /**
     * GUIDを生成します。
     * @param GUID
     */
    GuidUtil.createGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
    return GuidUtil;
})();
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
describe('部署モデル', function () {
    var departmentModel = null;
    beforeEach(function () {
        var employeeModelList = [];
        var employeeListModel = new EmployeeListModel('1', employeeModelList);
        // テスト対象
        departmentModel = new DepartmentModel('1', 'システム開発部', employeeListModel);
    });
    describe('社員を部署に追加する', function () {
        it('社員IDと社員名を指定すると、社員が部署に追加される', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            var employeeModel = employeeModelList[0];
            expect(employeeModel.id()).toBe('1');
            expect(employeeModel.name()).toBe('テスト　太郎');
            expect(employeeModel.departmentModel()).toBe(departmentModel);
        });
    });
    describe('社員を部署から削除する', function () {
        it('指定した社員IDの社員が削除される', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            departmentModel.deleteEmployee('1');
            expect(employeeModelList.length).toBe(0);
        });
        it('指定した社員IDの社員でなければ、削除されない', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            departmentModel.deleteEmployee('2');
            expect(employeeModelList.length).toBe(1);
        });
    });
});
describe('社員CRUDビューモデル', function () {
    var employeeCrudViewModel = null;
    beforeEach(function (done) {
        spyOn(DepartmentRepository, 'findDepartmentAll').and.callFake(function (callback) {
            var departmentModelList = [];
            departmentModelList.push(new DepartmentModel('d1', 'システム開発部', new EmployeeListModel('el1', [])));
            departmentModelList.push(new DepartmentModel('d2', '営業部', new EmployeeListModel('el2', [])));
            var departmentListModel = new DepartmentListModel('dl1', departmentModelList);
            callback(departmentListModel);
        });
        new EmployeeCrudViewModel(function (viewModel) {
            employeeCrudViewModel = viewModel;
            done();
        });
    });
    describe('すべての部署と所属する社員を保存する', function () {
        it('すべての部署と所属する社員が、サーバーに保存される', function () {
            spyOn(DepartmentRepository, 'saveDepartmentAll').and.callFake(function (departmentListModel, callback) {
                expect(departmentListModel.id()).toBe('dl1');
                expect(departmentListModel.departmentModelList().length).toBe(2);
                callback();
            });
            employeeCrudViewModel.saveDepartmentAll();
        });
    });
});
