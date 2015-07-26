/**
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

