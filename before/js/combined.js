/**
 * 値をko.observable化して返す。
 * 値が既にko.observableであれば、そのまま返す。
 * @param value 値
 * @return {ko.observable}
 */
function observable(value) {

    if (ko.isObservable(value)) {
        return value;
    }
    return ko.observable(value);
}

/**
 * 値をko.observableArray化して返す。
 * 値が既にko.observableArrayであれば、そのまま返す。
 * @param array 配列
 * @return {ko.observableArray}
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

﻿/**
 * 基底モデルクラス。
 */
var BaseModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - ID
     */
    var self = function (id) {
        this.id = observable(id || '');
    };

    return self;

})();



﻿/**
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


﻿/**
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


﻿/**
 * 社員リストモデルクラス。
 */
var EmployeeListModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員リストモデルID
     * @param {EmployeeModel} employeeModelList - 社員モデルリスト
     */
    var self = function (id, employeeModelList) {

        // メンバ変数の継承
        BaseModel.apply(this, [id]);

        this.employeeModelList = observableArray(employeeModelList || []);
    };

    // メソッドの継承
    self.prototype = Object.create(BaseModel.prototype);
    self.prototype.constructor = self;

    return self;

})();


﻿/**
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


﻿/**
 * 部署モデルのリポジトリクラス。
 */
var DepartmentRepository = {

    /**
     * ローカルストレージキー。
     * @return {string}
     */
    LOCAL_STORAGE_KEY: 'sample.all-department-model',

    /**
     * すべての部署モデルを返す。
     * @param {function} callback - コールバック関数
     */
    findDepartmentAll: function (callback) {

        var departmentListModel = null;

        var item = localStorage.getItem(this.LOCAL_STORAGE_KEY);

        if (item === null) {
            departmentListModel = this.createDepartmentListModelFromDefault();
        } else {
            departmentListModel = this.createDepartmentListModelFromXml(item);
        }

        // サーバーへのAjax通信を想定してコールバック
        callback(departmentListModel);
    },

    /**
     * すべての部署モデルを保存する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @param {function} callback - コールバック関数
     */
    saveDepartmentAll: function (departmentListModel, callback) {

        var xml = this.createDepartmentListModelXml(departmentListModel);
        
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);

        // サーバーへのAjax通信を想定してコールバック
        callback();
    },

    /**
     * 部署リストモデルのXMLデータを生成する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @return {String}
     */
    createDepartmentListModelXml: function (departmentListModel) {

        var xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';

        /// <var elementType='DepartmentModel' />
        var departmentModelList = departmentListModel.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];

            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';

            var employeeListModel = departmentModel.employeeListModel();

            xml += '            <id>' + employeeListModel.id() + '</id>';

            /// <var elementType='EmployeeModel' />
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
    },

    /**
     * 部署リストモデルをデフォルト値から生成する。
     * @return {DepartmentListModel}
     */
    createDepartmentListModelFromDefault: function () {

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
    },

    /**
     * 部署リストモデルをXMLから生成する。
     * @param {string} xml - XML
     * @return {DepartmentListModel}
     */
    createDepartmentListModelFromXml: function (xml) {

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
            var departmentModel = new DepartmentModel(departmentId, departmentName,
                                                        new EmployeeListModel(employeeListModelId, []));

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
    }
}


﻿/**
 * GUIDのユーティリティクラス。
 */
var GuidUtil = {

    /**
     * GUIDを生成する。
     * @param {string}
     */
    createGuid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
    }
}


﻿/**
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


﻿/**
 * 社員リストのビューモデルクラス。
 */
var EmployeeListViewModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     */
    var self = function () {

        /// <field name='employeeListModel' type='EmployeeListModel' />

        /**
         * 選択行のインデックス番号。
         * @return {number}
         */
        this.selectedRowIdx = observable(0);

        /**
         * 社員リストモデル。
         * @return {EmployeeListModel}
         */
        this.employeeListModel = observable(new EmployeeListModel(GuidUtil.createGuid(), []));
    };

    /**
     * 選択された社員を返す。
     * @return {Employee}
     */
    self.prototype.getSelectedEmployee = function () {

        var employeeListModel = this.employeeListModel();
        var employeeModelList = employeeListModel.employeeModelList();

        var employee = null;
        if (this.selectedRowIdx() >= 0 && this.selectedRowIdx() < employeeModelList.length) {
            employee = employeeListModel.employeeModelList()[this.selectedRowIdx()];
        }

        return employee;
    };

    return self;

})();


