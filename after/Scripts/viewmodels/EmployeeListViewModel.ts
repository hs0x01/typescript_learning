/**
 * 社員リストのビューモデルです。
 */
class EmployeeListViewModel {

    /**
     * 選択された行のインデックスです。
     */
    private _selectedRowIdx: KnockoutObservable<number>;

    /**
     * 社員リストモデルです。
     */
    private _employeeListModel: KnockoutObservable<EmployeeListModel>;

    /**
     * コンストラクタです。
     */
    constructor () {

        this._selectedRowIdx = observable(0);
        this._employeeListModel = observable(new EmployeeListModel(GuidUtil.createGuid(), []));
    }

    /**
     * 選択された行のインデックスを返します。
     * @return 選択された行のインデックス
     */
    get selectedRowIdx(): KnockoutObservable<number> {
        return this._selectedRowIdx;
    }

    /**
     * 選択された行のインデックスを設定します。
     * @param value 選択された行のインデックス
     */
    set selectedRowIdx(value: KnockoutObservable<number>) {
        this._selectedRowIdx = value;
    }

    /**
     * 社員リストモデルを返します。
     * @return 社員リストモデル
     */
    get employeeListModel(): KnockoutObservable<EmployeeListModel> {
        return this._employeeListModel;
    }

    /**
     * 社員リストモデルを設定します。
     * @param value 社員リストモデル
     */
    set employeeListModel(value: KnockoutObservable<EmployeeListModel>) {
        this._employeeListModel = value;
    }

    /**
     * 選択された社員を返します。
     * @return 選択された社員。存在しない場合、<code>null</code>を返します。
     */
    getSelectedEmployee(): EmployeeModel {

        var employeeListModel: EmployeeListModel = this.employeeListModel();
        var employeeModelList: Array<EmployeeModel> = employeeListModel.employeeModelList();

        var employee: EmployeeModel = null;
        if (this.selectedRowIdx() >= 0 && this.selectedRowIdx() < employeeModelList.length) {
            employee = employeeListModel.employeeModelList()[this.selectedRowIdx()];
        }

        return employee;
    }
}
