/**
 * 社員リストのビューモデルクラス。
 */
class EmployeeListViewModel {

    private _selectedRowIdx: KnockoutObservable<number>;
    private _employeeListModel: KnockoutObservable<EmployeeListModel>;

    /**
     * コンストラクタ。
     * @constructor
     */
    constructor () {

        /**
         * 選択行のインデックス番号。
         * @return {number}
         */
        this._selectedRowIdx = observable(0);

        /**
         * 社員リストモデル。
         * @return {EmployeeListModel}
         */
        this._employeeListModel = observable(new EmployeeListModel(GuidUtil.createGuid(), []));
    }

    // アクセサ
    get selectedRowIdx(): KnockoutObservable<number> {
        return this._selectedRowIdx;
    }
    set selectedRowIdx(value: KnockoutObservable<number>) {
        this._selectedRowIdx = value;
    }
    get employeeListModel(): KnockoutObservable<EmployeeListModel> {
        return this._employeeListModel;
    }
    set employeeListModel(value: KnockoutObservable<EmployeeListModel>) {
        this._employeeListModel = value;
    }

    /**
     * 選択された社員を返す。
     * @return {EmployeeModel}
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

