/**
 * 値を{@code ko.observable}化して返します。
 * <p>
 * 値が既に<code>ko.observable</code>であれば、それを返します。
 * </p>
 * @param value 値
 * @return <code>ko.observable</code>な値
 */
declare function observable<T>(value: T): KnockoutObservable<T>;
/**
 * 値を<code>ko.observableArray</code>化して返します。
 * <p>
 * 値が既に<code>ko.observableArray</code>であれば、それを返します。
 * </p>
 * @param array 配列
 * @return <code>ko.observableArray</code>な値
 */
declare function observableArray<T>(array: Array<T>): KnockoutObservableArray<T>;
/**
 * すべてのモデルが共通に継承すべきモデルです。
 */
declare abstract class BaseModel {
    /**
     * オブジェクトIDです。
     * <p>
     * オブジェクトを一意に特定します。
     * </p>
     */
    private _id;
    /**
     * オブジェクトIDを引数にとるコンストラクタです。
     * @param id オブジェクトID
     */
    constructor(id: string);
    /**
     * オブジェクトIDを返します。
     * @return オブジェクトID
     */
    /**
     * オブジェクトIDを設定します。
     * @param value オブジェクトID
     */
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
