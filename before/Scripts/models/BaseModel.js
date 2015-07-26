/**
 * 基底モデルクラス。
 */
var BaseModel = (function () {

    /**
     * コンストラクタ。
     * @constructor
     * @param {string} id - ID
     */
    var self = function (id) {
        this.id = observable(id || '');
    };

    return self;

})();


