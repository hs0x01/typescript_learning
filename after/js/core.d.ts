/**
 * 値を<code>ko.observable</code>化して返します。
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
 * 部署モデルのリストを扱うモデルです。
 */
declare class DepartmentListModel extends BaseModel {
    /**
     * 部署モデルのリストです。
     */
    private _departmentModelList;
    /**
     * コンストラクタです。
     * @param id 当モデルのID
     * @param departmentModelList 部署モデルのリスト
     */
    constructor(id: string, departmentModelList: Array<DepartmentModel>);
    /**
     * 部署モデルのリストを返します。
     * @return 部署モデルのリスト
     */
    /**
     * 部署モデルのリストを設定します。
     * @param value 部署モデルのリスト
     */
    departmentModelList: KnockoutObservableArray<DepartmentModel>;
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
    findEmployeeByArgs(employeeId: string, employeeName: string, departmentId: string): Array<EmployeeModel>;
    /**
     * 部署IDを条件に部署モデルを検索します。
     * @param departmentId 部署ID
     * @return 部署モデル。検索結果が0件の場合、<code>null</code>を返します。
     */
    findDepartmentById(departmentId: string): DepartmentModel;
}
/**
 * 部署モデルです。
 */
declare class DepartmentModel extends BaseModel {
    /**
     * 部署名です。
     */
    private _name;
    /**
     * 社員リストモデルです。
     */
    private _employeeListModel;
    /**
     * コンストラクタです。
     * @param id 部署のID
     * @param name 部署名
     * @param employeeListModel 社員リストモデル
     */
    constructor(id: string, name: string, employeeListModel: EmployeeListModel);
    /**
     * 部署名を返します。
     * @return 部署名
     */
    /**
     * 部署名を設定します。
     * @param value 部署名
     */
    name: KnockoutObservable<string>;
    /**
     * 社員リストモデルを返します。
     * @return 社員リストモデル
     */
    /**
     * 社員リストモデルを設定します。
     * @param value 社員リストモデル
     */
    employeeListModel: KnockoutObservable<EmployeeListModel>;
    /**
     * 当部署に社員を追加します。
     * @param employeeId 社員ID
     * @param employeeName 社員名
     */
    addEmployee(employeeId: string, employeeName: string): void;
    /**
     * 当部署から社員を削除します。
     * @param employeeId 社員ID
     */
    deleteEmployee(employeeId: string): void;
}
/**
 * 社員モデルのリストを扱うモデルです。
 */
declare class EmployeeListModel extends BaseModel {
    /**
     * 社員モデルのリストです。
     */
    private _employeeModelList;
    /**
     * コンストラクタです。
     * @param id 社員リストモデルID
     * @param employeeModelList 社員モデルリスト
     */
    constructor(id: string, employeeModelList: Array<EmployeeModel>);
    /**
     * 社員モデルリストを返します。
     * @return 社員モデルリスト
     */
    /**
     * 社員モデルリストを設定します。
     * @param value 社員モデルリスト
     */
    employeeModelList: KnockoutObservableArray<EmployeeModel>;
}
/**
 * 社員モデルです。
 */
declare class EmployeeModel extends BaseModel {
    /**
     * 社員名です。
     */
    private _name;
    /**
     * 所属部署です。
     */
    private _departmentModel;
    /**
     * コンストラクタです。
     * @param id - 社員ID
     * @param name - 社員名
     * @param departmentModel - 所属部署のモデル
     */
    constructor(id: string, name: string, departmentModel: DepartmentModel);
    /**
     * 社員名を返します。
     * @return 社員名
     */
    /**
     * 社員名を設定します。
     * @param value 社員名
     */
    name: KnockoutObservable<string>;
    /**
     * 所属部署を返します。
     * @return 所属部署
     */
    /**
     * 所属部署を設定します。
     * @param value 所属部署
     */
    departmentModel: KnockoutObservable<DepartmentModel>;
    /**
     * 社員情報を更新します。
     * @param name 社員名
     * @param departmentModel 新しく所属する部署モデル
     */
    updateEmployeeInfo(name: string, departmentModel: DepartmentModel): void;
}
/**
 * 部署モデルのリポジトリです。
 */
declare class DepartmentRepository {
    /**
     * ローカルストレージキーです。
     */
    private static LOCAL_STORAGE_KEY;
    /**
     * すべての部署モデルを返します。
     * <p>
     * すべての部署モデル(<code>DepartmentListModel</code>)は、コールバック関数の引数として返します。
     * </p>
     * @param callback コールバック関数
     */
    static findDepartmentAll(callback: Function): void;
    /**
     * すべての部署モデルを保存します。
     * <p>現在、ローカルストレージに保存しています。</p>
     * <p>保存完了は、コールバック関数を呼び出すことにより通知します。</p>
     * @param departmentListModel 部署リストモデル
     * @param callback コールバック関数
     */
    static saveDepartmentAll(departmentListModel: DepartmentListModel, callback: Function): void;
    /**
     * 部署リストモデルのXMLデータを生成します。
     * @param departmentListModel 部署リストモデル
     * @return 部署リストモデルのXMLデータ
     */
    static createDepartmentListModelXml(departmentListModel: DepartmentListModel): string;
    /**
     * 部署リストモデルをデフォルト値から生成します。
     * @return 部署モデルリスト
     */
    static createDepartmentListModelFromDefault(): DepartmentListModel;
    /**
     * 部署リストモデルをXMLから生成します。
     * @param xml XML
     * @return 部署リストモデル
     */
    static createDepartmentListModelFromXml(xml: string): DepartmentListModel;
}
/**
 * GUIDのユーティリティです。
 */
declare class GuidUtil {
    /**
     * GUIDを生成します。
     * @param GUID
     */
    static createGuid(): string;
}
