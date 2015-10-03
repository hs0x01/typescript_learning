/// <reference path="../Scripts/lib/knockout.d.ts" />
/**
 * 値をko.observable化して返す。
 * 値が既にko.observableであれば、そのまま返す。
 * @param value 値
 * @return {ko.observable}
 */
declare function observable<T>(value: T): KnockoutObservable<T>;
/**
 * 値をko.observableArray化して返す。
 * 値が既にko.observableArrayであれば、そのまま返す。
 * @param array 配列
 * @return {ko.observableArray}
 */
declare function observableArray<T>(array: Array<T>): KnockoutObservableArray<T>;
/**
 * 基底モデルクラス。
 */
declare class BaseModel {
    private _id;
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - ID
     */
    constructor(id: string);
    id: KnockoutObservable<string>;
}
/**
 * 部署リストモデルクラス。
 */
declare class DepartmentListModel extends BaseModel {
    private _departmentModelList;
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署リストモデルID
     * @param {DepartmentModel} departmentModelList - 部署モデルリスト
     */
    constructor(id: any, departmentModelList: any);
    departmentModelList: KnockoutObservableArray<DepartmentModel>;
    /**
     * 引数を条件に社員モデルを検索し、結果を返す。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     * @param {string} departmentId - 部署ID
     * @return {EmployeeModel} 社員モデルのリスト
     */
    findEmployeeByArgs(employeeId: string, employeeName: string, departmentId: string): Array<EmployeeModel>;
    /**
     * 部署IDを条件に部署モデルを検索し、結果を返す。
     * @param {string} departmentId - 部署ID
     * @return {DepartmentModel} 部署モデル
     */
    findDepartmentById(departmentId: string): DepartmentModel;
}
/**
 * @class 部署モデルクラス。
 */
declare class DepartmentModel extends BaseModel {
    private _name;
    private _employeeListModel;
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 部署ID
     * @param {string} name - 部署名
     * @param {EmployeeListModel} employeeListModel - 社員リストモデル
     */
    constructor(id: string, name: string, employeeListModel: EmployeeListModel);
    name: KnockoutObservable<string>;
    employeeListModel: KnockoutObservable<EmployeeListModel>;
    /**
     * 当部署に社員を追加する。
     * @param {string} employeeId - 社員ID
     * @param {string} employeeName - 社員名
     */
    addEmployee(employeeId: string, employeeName: string): void;
    /**
     * 当部署から社員を削除する。
     * @param {string} employeeId - 社員ID
     */
    deleteEmployee(employeeId: string): void;
}
/**
 * 社員リストモデルクラス。
 */
declare class EmployeeListModel extends BaseModel {
    private _employeeModelList;
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員リストモデルID
     * @param {EmployeeModel} employeeModelList - 社員モデルリスト
     */
    constructor(id: any, employeeModelList: any);
    employeeModelList: KnockoutObservableArray<EmployeeModel>;
}
/**
 * 社員モデルクラス。
 */
declare class EmployeeModel extends BaseModel {
    private _name;
    private _departmentModel;
    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    constructor(id: string, name: string, departmentModel: DepartmentModel);
    name: KnockoutObservable<string>;
    departmentModel: KnockoutObservable<DepartmentModel>;
    /**
     * 社員情報を更新する。
     * @param {string} id - 社員ID
     * @param {string} name - 社員名
     * @param {DepartmentModel} departmentModel - 部署モデル
     */
    updateEmployeeInfo(id: string, name: string, departmentModel: DepartmentModel): void;
}
/**
 * 部署モデルのリポジトリクラス。
 */
declare class DepartmentRepository {
    /**
     * ローカルストレージキー。
     * @return {string}
     */
    private static LOCAL_STORAGE_KEY;
    /**
     * すべての部署モデルを返す。
     * @param {function} callback - コールバック関数
     */
    static findDepartmentAll(callback: Function): void;
    /**
     * すべての部署モデルを保存する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @param {function} callback - コールバック関数
     */
    static saveDepartmentAll(departmentListModel: DepartmentListModel, callback: Function): void;
    /**
     * 部署リストモデルのXMLデータを生成する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @return {String}
     */
    static createDepartmentListModelXml(departmentListModel: DepartmentListModel): string;
    /**
     * 部署リストモデルをデフォルト値から生成する。
     * @return {DepartmentListModel}
     */
    static createDepartmentListModelFromDefault(): DepartmentListModel;
    /**
     * 部署リストモデルをXMLから生成する。
     * @param {string} xml - XML
     * @return {DepartmentListModel}
     */
    static createDepartmentListModelFromXml(xml: string): DepartmentListModel;
}
/**
 * GUIDのユーティリティクラス。
 */
declare class GuidUtil {
    /**
     * GUIDを生成する。
     * @param {string}
     */
    static createGuid(): string;
}
/**
 * 社員CRUD機能のビューモデルクラス。
 */
declare class EmployeeCrudViewModel {
    /**
     * 社員ID-更新系。
     * @return {string}
     */
    private _employeeId;
    /**
     * 社員名-更新系。
     * @return {string}
     */
    private _employeeName;
    /**
     * 部署-更新系。
     * @return {DepartmentModel}
     */
    private _department;
    /**
     * 社員ID-検索。
     * @return {string}
     */
    private _employeeIdFind;
    /**
     * 社員名-検索。
     * @return {string}
     */
    private _employeeNameFind;
    /**
     * 部署-検索。
     * @return {DepartmentModel}
     */
    private _departmentFind;
    /**
     * 部署リストモデル。
     * @return {DepartmentListModel}
     */
    private _departmentListModel;
    /**
     * 社員リストビューモデル。
     * @return {EmployeeListViewModel}
     */
    private _employeeListViewModel;
    /**
     * コンストラクタ。
     * @constructor
     * @param {function} callback - コールバック関数
     */
    constructor(callback: any);
    employeeId: KnockoutObservable<string>;
    employeeName: KnockoutObservable<string>;
    department: KnockoutObservable<DepartmentModel>;
    employeeIdFind: KnockoutObservable<string>;
    employeeNameFind: KnockoutObservable<string>;
    departmentFind: KnockoutObservable<DepartmentModel>;
    departmentListModel: KnockoutObservable<DepartmentListModel>;
    employeeListViewModel: EmployeeListViewModel;
    /**
     * メンバ変数の検索条件により、社員を検索する。
     * 結果は、社員リストビューモデルを更新することで通知する。
     */
    findEmployee(): void;
    /**
     * 社員を選択する。
     */
    selectEmployee(): void;
    /**
     * 部署に社員を追加可能か判定し、結果を返す。
     * return {boolean}
     */
    canAddEmployee(): boolean;
    /**
     * 社員情報を更新可能か判定し、結果を返す。
     * return {boolean}
     */
    canUpdateEmployee(): boolean;
    /**
     * 部署から社員を削除可能か判定し、結果を返す。
     * return {boolean}
     */
    canDeleteEmployee(): boolean;
    /**
     * 部署に社員を追加する。
     */
    addEmployee(): void;
    /**
     * 社員情報を更新する。
     */
    updateEmployee(): void;
    /**
     * 部署から社員を削除する。
     */
    deleteEmployee(): void;
    /**
     * すべての部署と所属する社員を保存する。
     */
    saveDepartmentAll(): void;
    /**
     * 入力値をリセットする。
     */
    resetInput: () => void;
}
/**
 * 社員リストのビューモデルクラス。
 */
declare class EmployeeListViewModel {
    private _selectedRowIdx;
    private _employeeListModel;
    /**
     * コンストラクタ。
     * @constructor
     */
    constructor();
    selectedRowIdx: KnockoutObservable<number>;
    employeeListModel: KnockoutObservable<EmployeeListModel>;
    /**
     * 選択された社員を返す。
     * @return {EmployeeModel}
     */
    getSelectedEmployee(): EmployeeModel;
}
