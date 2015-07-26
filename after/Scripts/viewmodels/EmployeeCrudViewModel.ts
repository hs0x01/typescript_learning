/**
 * 社員CRUD機能のビューモデルクラス。
 */
class EmployeeCrudViewModel {

    /**
     * 社員ID-更新系。
     * @return {string}
     */
    private _employeeId: KnockoutObservable<string> = observable('');

    /**
     * 社員名-更新系。
     * @return {string}
     */
    private _employeeName: KnockoutObservable<string> = observable('');

    /**
     * 部署-更新系。
     * @return {DepartmentModel}
     */
    private _department: KnockoutObservable<DepartmentModel> = observable(null);

    /**
     * 社員ID-検索。
     * @return {string}
     */
    private _employeeIdFind: KnockoutObservable<string> = observable('');

    /**
     * 社員名-検索。
     * @return {string}
     */
    private _employeeNameFind: KnockoutObservable<string> = observable('');

    /**
     * 部署-検索。
     * @return {DepartmentModel}
     */
    private _departmentFind: KnockoutObservable<DepartmentModel> = observable(null);

    /**
     * 部署リストモデル。
     * @return {DepartmentListModel}
     */
    private _departmentListModel: KnockoutObservable<DepartmentListModel> = observable(null);

    /**
     * 社員リストビューモデル。
     * @return {EmployeeListViewModel}
     */
    private _employeeListViewModel: EmployeeListViewModel = new EmployeeListViewModel();

    /**
     * コンストラクタ。
     * @constructor
     * @param {function} callback - コールバック関数
     */
    constructor (callback) {

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

    // アクセサ
    get employeeId(): KnockoutObservable<string> {
        return this._employeeId;
    }
    set employeeId(value: KnockoutObservable<string>) {
        this._employeeId = value;
    }
    get employeeName(): KnockoutObservable<string> {
        return this._employeeName;
    }
    set employeeName(value: KnockoutObservable<string>) {
        this._employeeName = value;
    }
    get department(): KnockoutObservable<DepartmentModel> {
        return this._department;
    }
    set department(value: KnockoutObservable<DepartmentModel>) {
        this._department = value;
    }
    get employeeIdFind(): KnockoutObservable<string> {
        return this._employeeIdFind;
    }
    set employeeIdFind(value: KnockoutObservable<string>) {
        this._employeeIdFind = value;
    }
    get employeeNameFind(): KnockoutObservable<string> {
        return this._employeeNameFind;
    }
    set employeeNameFind(value: KnockoutObservable<string>) {
        this._employeeNameFind = value;
    }
    get departmentFind(): KnockoutObservable<DepartmentModel> {
        return this._departmentFind;
    }
    set departmentFind(value: KnockoutObservable<DepartmentModel>) {
        this._departmentFind = value;
    }
    get departmentListModel(): KnockoutObservable<DepartmentListModel> {
        return this._departmentListModel;
    }
    set departmentListModel(value: KnockoutObservable<DepartmentListModel>) {
        this._departmentListModel = value;
    }
    get employeeListViewModel(): EmployeeListViewModel {
        return this._employeeListViewModel;
    }
    set employeeListViewModel(value: EmployeeListViewModel) {
        this._employeeListViewModel = value;
    }

    /**
     * メンバ変数の検索条件により、社員を検索する。
     * 結果は、社員リストビューモデルを更新することで通知する。
     */
    findEmployee() {

        var employeeList: Array<EmployeeModel> = this.departmentListModel().findEmployeeByArgs(
                                            this.employeeIdFind(),
                                            this.employeeNameFind(),
                                            !this.departmentFind() ? null : this.departmentFind().id());

        var employeeModelList: KnockoutObservableArray<EmployeeModel>
                                    = this.employeeListViewModel.employeeListModel().employeeModelList;

        employeeModelList(employeeList);
    }

    /**
     * 社員を選択する。
     */
    selectEmployee() {
        var selectedEmployee: EmployeeModel = this.employeeListViewModel.getSelectedEmployee();
        this.employeeId(selectedEmployee.id());
        this.employeeName(selectedEmployee.name());
        this.department(selectedEmployee.departmentModel());
    }

    /**
     * 部署に社員を追加可能か判定し、結果を返す。
     * return {boolean}
     */
    canAddEmployee(): boolean {

        if (!this.employeeId()) {
            return false;
        }
        if (!this.employeeName()) {
            return false;
        }
        if (!this.department() || !this.department().id()) {
            return false;
        }

        var employeeList: Array<EmployeeModel> =
                        this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length > 0) {
            return false;
        }

        return true;
    }

    /**
     * 社員情報を更新可能か判定し、結果を返す。
     * return {boolean}
     */
    canUpdateEmployee(): boolean {

        if (!this.employeeId()) {
            return false;
        }
        if (!this.employeeName()) {
            return false;
        }
        if (!this.department() || !this.department().id()) {
            return false;
        }

        var employeeList: Array<EmployeeModel> =
                        this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * 部署から社員を削除可能か判定し、結果を返す。
     * return {boolean}
     */
    canDeleteEmployee(): boolean {

        if (!this.employeeId()) {
            return false;
        }
        
        var employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * 部署に社員を追加する。
     */
    addEmployee() {

        if (!this.canAddEmployee()) {
            return;
        }

        var departmentModel: DepartmentModel =
                    this.departmentListModel().findDepartmentById(this.department().id());

        // 追加
        departmentModel.addEmployee(this.employeeId(), this.employeeName());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * 社員情報を更新する。
     */
    updateEmployee() {

        if (!this.canUpdateEmployee()) {
            return;
        }

        var employeeList: Array<EmployeeModel> =
                    this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);

        var employeeModel: EmployeeModel = employeeList[0];

        // 更新
        employeeModel.updateEmployeeInfo(this.employeeId(), this.employeeName(), this.department());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * 部署から社員を削除する。
     */
    deleteEmployee() {

        if (!this.canDeleteEmployee()) {
            return;
        }

        var employeeList: Array<EmployeeModel> =
                    this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);

        var employeeModel: EmployeeModel = employeeList[0];

        // 削除
        employeeModel.departmentModel().deleteEmployee(this.employeeId());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * すべての部署と所属する社員を保存する。
     */
    saveDepartmentAll() {
        DepartmentRepository.saveDepartmentAll(this.departmentListModel(), function () {
        });
    }

    /**
     * 入力値をリセットする。
     */
    resetInput = function () {
        this.employeeId('');
        this.employeeName('');
        this.department(null);
        this.employeeIdFind('');
        this.employeeNameFind('');
        this.departmentFind(null);
    }
}

