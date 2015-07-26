/**
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

