/**
 * 値を{@code ko.observable}化して返します。
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
 * 部署リストモデルクラス。
 */
var DepartmentListModel = (function (_super) {
    __extends(DepartmentListModel, _super);
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署リストモデルID
     * @param {DepartmentModel} departmentModelList - 部署モデルリスト
     */
    function DepartmentListModel(id, departmentModelList) {
        _super.call(this, id);
        this._departmentModelList = observableArray(departmentModelList || []);
    }
    Object.defineProperty(DepartmentListModel.prototype, "departmentModelList", {
        // アクセサ
        get: function () {
            return this._departmentModelList;
        },
        set: function (value) {
            this._departmentModelList = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 引数を条件に社員モデルを検索し、結果を返す。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     * @param {string} departmentId - 部署ID
     * @return {EmployeeModel} 社員モデルのリスト
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
     * 部署IDを条件に部署モデルを検索し、結果を返す。
     * @param {string} departmentId - 部署ID
     * @return {DepartmentModel} 部署モデル
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
 * @class 部署モデルクラス。
 */
var DepartmentModel = (function (_super) {
    __extends(DepartmentModel, _super);
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署ID
     * @param {string} name - 部署名
     * @param {EmployeeListModel} employeeListModel - 社員リストモデル
     */
    function DepartmentModel(id, name, employeeListModel) {
        _super.call(this, id);
        this._name = observable(name || '');
        this._employeeListModel = observable(employeeListModel || null);
    }
    Object.defineProperty(DepartmentModel.prototype, "name", {
        // アクセサ
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DepartmentModel.prototype, "employeeListModel", {
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
     * 当部署に社員を追加する。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     */
    DepartmentModel.prototype.addEmployee = function (employeeId, employeeName) {
        var employeeModel = new EmployeeModel(employeeId, employeeName, this);
        this.employeeListModel().employeeModelList.push(employeeModel);
    };
    /**
     * 当部署から社員を削除する。
     * @param {string} employeeId - 社員ID
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
 * 社員リストモデルクラス。
 */
var EmployeeListModel = (function (_super) {
    __extends(EmployeeListModel, _super);
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員リストモデルID
     * @param {EmployeeModel} employeeModelList - 社員モデルリスト
     */
    function EmployeeListModel(id, employeeModelList) {
        _super.call(this, id);
        this._employeeModelList = observableArray(employeeModelList || []);
    }
    Object.defineProperty(EmployeeListModel.prototype, "employeeModelList", {
        // アクセサ
        get: function () {
            return this._employeeModelList;
        },
        set: function (value) {
            this._employeeModelList = value;
        },
        enumerable: true,
        configurable: true
    });
    return EmployeeListModel;
})(BaseModel);
/**
 * 社員モデルクラス。
 */
var EmployeeModel = (function (_super) {
    __extends(EmployeeModel, _super);
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    function EmployeeModel(id, name, departmentModel) {
        _super.call(this, id);
        this._name = observable(name || '');
        this._departmentModel = observable(departmentModel || null);
    }
    Object.defineProperty(EmployeeModel.prototype, "name", {
        // アクセサ
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeModel.prototype, "departmentModel", {
        get: function () {
            return this._departmentModel;
        },
        set: function (value) {
            this._departmentModel = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 社員情報を更新する。
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    EmployeeModel.prototype.updateEmployeeInfo = function (id, name, departmentModel) {
        this.name(name);
        if (this.departmentModel().id() !== departmentModel.id()) {
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
    return EmployeeModel;
})(BaseModel);
;
/**
 * 部署モデルのリポジトリクラス。
 */
var DepartmentRepository = (function () {
    function DepartmentRepository() {
    }
    /**
     * すべての部署モデルを返す。
     * @param {function} callback - コールバック関数
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
     * すべての部署モデルを保存する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @param {function} callback - コールバック関数
     */
    DepartmentRepository.saveDepartmentAll = function (departmentListModel, callback) {
        var xml = this.createDepartmentListModelXml(departmentListModel);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);
        // サーバーへのAjax通信を想定してコールバック
        callback();
    };
    /**
     * 部署リストモデルのXMLデータを生成する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @return {String}
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
     * 部署リストモデルをデフォルト値から生成する。
     * @return {DepartmentListModel}
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
     * 部署リストモデルをXMLから生成する。
     * @param {string} xml - XML
     * @return {DepartmentListModel}
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
     * ローカルストレージキー。
     * @return {string}
     */
    DepartmentRepository.LOCAL_STORAGE_KEY = 'sample.all-department-model';
    return DepartmentRepository;
})();
/**
 * GUIDのユーティリティクラス。
 */
var GuidUtil = (function () {
    function GuidUtil() {
    }
    /**
     * GUIDを生成する。
     * @param {string}
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
