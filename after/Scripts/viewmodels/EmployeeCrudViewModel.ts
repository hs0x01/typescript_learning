/**
 * 社員CRUD機能のビューモデルです。
 */
class EmployeeCrudViewModel {

    /**
     * 更新条件となる社員IDです。
     */
    private _employeeId: KnockoutObservable<string> = observable('');

    /**
     * 更新条件となる社員名です。
     */
    private _employeeName: KnockoutObservable<string> = observable('');

    /**
     * 更新条件となる部署です。
     */
    private _department: KnockoutObservable<DepartmentModel> = observable(null);

    /**
     * 検索条件となる社員IDです。
     */
    private _employeeIdFind: KnockoutObservable<string> = observable('');

    /**
     * 検索条件となる社員名です。
     */
    private _employeeNameFind: KnockoutObservable<string> = observable('');

    /**
     * 検索条件となる部署です。
     */
    private _departmentFind: KnockoutObservable<DepartmentModel> = observable(null);

    /**
     * 部署リストモデルです。
     */
    private _departmentListModel: KnockoutObservable<DepartmentListModel> = observable(null);

    /**
     * 社員リストビューモデルです。
     */
    private _employeeListViewModel: EmployeeListViewModel = new EmployeeListViewModel();

    /**
     * コンストラクタです。
     * <p>当ビューモデルを使える状態に初期化します。</p>
     * @param callback 初期化完了で呼び出すコールバック関数
     */
    constructor(callback: Function) {

        let thisViewModel = this;

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
        DepartmentRepository.findDepartmentAll(function (departmentListModel: DepartmentListModel) {

            thisViewModel._departmentListModel(departmentListModel);

            // 初期化完了によりコールバック
            callback(thisViewModel);
        });
    }

    /**
     * 更新条件となる社員IDを返します。
     * @return 更新条件となる社員ID
     */
    get employeeId(): KnockoutObservable<string> {
        return this._employeeId;
    }

    /**
     * 更新条件となる社員IDを設定します。
     * @param value 更新条件となる社員ID
     */
    set employeeId(value: KnockoutObservable<string>) {
        this._employeeId = value;
    }

    /**
     * 更新条件となる社員名を返します。
     * @return 更新条件となる社員名
     */
    get employeeName(): KnockoutObservable<string> {
        return this._employeeName;
    }

    /**
     * 更新条件となる社員名を設定します。
     * @param value 更新条件となる社員名
     */
    set employeeName(value: KnockoutObservable<string>) {
        this._employeeName = value;
    }

    /**
     * 更新条件となる部署を返します。
     * @return 更新条件となる部署
     */
    get department(): KnockoutObservable<DepartmentModel> {
        return this._department;
    }

    /**
     * 更新条件となる部署を設定します。
     * @param value 更新条件となる部署
     */
    set department(value: KnockoutObservable<DepartmentModel>) {
        this._department = value;
    }

    /**
     * 検索条件となる社員IDを返します。
     * @return 検索条件となる社員ID
     */
    get employeeIdFind(): KnockoutObservable<string> {
        return this._employeeIdFind;
    }

    /**
     * 検索条件となる社員IDを設定します。
     * @param value 検索条件となる社員ID
     */
    set employeeIdFind(value: KnockoutObservable<string>) {
        this._employeeIdFind = value;
    }

    /**
     * 検索条件となる社員名を返します。
     * @return 検索条件となる社員名
     */
    get employeeNameFind(): KnockoutObservable<string> {
        return this._employeeNameFind;
    }

    /**
     * 検索条件となる社員名を設定します。
     * @param value 検索条件となる社員名
     */
    set employeeNameFind(value: KnockoutObservable<string>) {
        this._employeeNameFind = value;
    }

    /**
     * 検索条件となる部署を返します。
     * @return 検索条件となる部署
     */
    get departmentFind(): KnockoutObservable<DepartmentModel> {
        return this._departmentFind;
    }

    /**
     * 検索条件となる部署を設定します。
     * @param value 検索条件となる部署
     */
    set departmentFind(value: KnockoutObservable<DepartmentModel>) {
        this._departmentFind = value;
    }

    /**
     * 部署リストモデルを返します。
     * @return 部署リストモデル
     */
    get departmentListModel(): KnockoutObservable<DepartmentListModel> {
        return this._departmentListModel;
    }

    /**
     * 部署リストモデルを設定します。
     * @param value 部署リストモデル
     */
    set departmentListModel(value: KnockoutObservable<DepartmentListModel>) {
        this._departmentListModel = value;
    }

    /**
     * 社員リストモデルを返します。
     * @return 社員リストモデル
     */
    get employeeListViewModel(): EmployeeListViewModel {
        return this._employeeListViewModel;
    }

    /**
     * 社員リストモデルを設定します。
     * @param value 社員リストモデル
     */
    set employeeListViewModel(value: EmployeeListViewModel) {
        this._employeeListViewModel = value;
    }

    /**
     * メンバ変数の検索条件により、社員を検索します。
     * <p>結果は、社員リストビューモデルを更新することで通知します。</p>
     */
    findEmployee() {

        this.employeeListViewModel.visible.valueHasMutated();

        let employeeList: Array<EmployeeModel> = this.departmentListModel().findEmployeeByArgs(
                                            this.employeeIdFind(),
                                            this.employeeNameFind(),
                                            !this.departmentFind() ? null : this.departmentFind().id());

        let employeeModelList: KnockoutObservableArray<EmployeeModel>
                                    = this.employeeListViewModel.employeeListModel().employeeModelList;

        employeeModelList(employeeList);
    }

    /**
     * 社員を選択します。
     */
    selectEmployee() {
        let selectedEmployee: EmployeeModel = this.employeeListViewModel.getSelectedEmployee();
        this.employeeId(selectedEmployee.id());
        this.employeeName(selectedEmployee.name());
        this.department(selectedEmployee.departmentModel());
    }

    /**
     * 部署に社員を追加可能か判定し、結果を返します。
     * @return 追加可能であれば<code>true</code>、そうでなければ<code>false</code>
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

        let employeeList: Array<EmployeeModel> =
                        this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length > 0) {
            return false;
        }

        return true;
    }

    /**
     * 社員情報を更新可能か判定し、結果を返します。
     * @return 更新可能であれば<code>true</code>、そうでなければ<code>false</code>
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

        let employeeList: Array<EmployeeModel> =
                        this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * 部署から社員を削除可能か判定し、結果を返します。
     * @return 削除可能であれば<code>true</code>、そうでなければ<code>false</code>
     */
    canDeleteEmployee(): boolean {

        if (!this.employeeId()) {
            return false;
        }
        
        let employeeList = this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);
        if (employeeList.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * 部署に社員を追加します。
     */
    addEmployee() {

        if (!this.canAddEmployee()) {
            return;
        }

        let departmentModel: DepartmentModel =
                    this.departmentListModel().findDepartmentById(this.department().id());

        // 追加
        departmentModel.addEmployee(this.employeeId(), this.employeeName());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * 社員情報を更新します。
     */
    updateEmployee() {

        if (!this.canUpdateEmployee()) {
            return;
        }

        let employeeList: Array<EmployeeModel> =
                    this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);

        let employeeModel: EmployeeModel = employeeList[0];

        // 更新
        employeeModel.updateEmployeeInfo(this.employeeName(), this.department());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * 部署から社員を削除します。
     */
    deleteEmployee() {

        if (!this.canDeleteEmployee()) {
            return;
        }

        let employeeList: Array<EmployeeModel> =
                    this.departmentListModel().findEmployeeByArgs(this.employeeId(), null, null);

        let employeeModel: EmployeeModel = employeeList[0];

        // 削除
        employeeModel.departmentModel().deleteEmployee(this.employeeId());

        // 入力値をリセット
        this.resetInput();

        // 再検索
        this.findEmployee();
    }

    /**
     * すべての部署と所属する社員を保存します。
     */
    saveDepartmentAll() {
        DepartmentRepository.saveDepartmentAll(this.departmentListModel(), function () {
        });
    }

    /**
     * 入力値をリセットします。
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

