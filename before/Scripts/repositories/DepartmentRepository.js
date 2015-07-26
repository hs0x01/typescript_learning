/**
 * 部署モデルのリポジトリクラス。
 */
var DepartmentRepository = {

    /**
     * ローカルストレージキー。
     * @return {string}
     */
    LOCAL_STORAGE_KEY: 'sample.all-department-model',

    /**
     * すべての部署モデルを返す。
     * @param {function} callback - コールバック関数
     */
    findDepartmentAll: function (callback) {

        var departmentListModel = null;

        var item = localStorage.getItem(this.LOCAL_STORAGE_KEY);

        if (item === null) {
            departmentListModel = this.createDepartmentListModelFromDefault();
        } else {
            departmentListModel = this.createDepartmentListModelFromXml(item);
        }

        // サーバーへのAjax通信を想定してコールバック
        callback(departmentListModel);
    },

    /**
     * すべての部署モデルを保存する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @param {function} callback - コールバック関数
     */
    saveDepartmentAll: function (departmentListModel, callback) {

        var xml = this.createDepartmentListModelXml(departmentListModel);
        
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);

        // サーバーへのAjax通信を想定してコールバック
        callback();
    },

    /**
     * 部署リストモデルのXMLデータを生成する。
     * @param {DepartmentListModel} departmentListModel - 部署リストモデル
     * @return {String}
     */
    createDepartmentListModelXml: function (departmentListModel) {

        var xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';

        /// <var elementType='DepartmentModel' />
        var departmentModelList = departmentListModel.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel = departmentModelList[i];

            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';

            var employeeListModel = departmentModel.employeeListModel();

            xml += '            <id>' + employeeListModel.id() + '</id>';

            /// <var elementType='EmployeeModel' />
            var employeeModelList = employeeListModel.employeeModelList();

            for (var j = 0; j < employeeModelList.length; j++) {
                var employeeModel = employeeModelList[j];

                xml += '        <employeeModel>';
                xml += '            <id>' + employeeModel.id() + '</id>';
                xml += '            <name>' + employeeModel.name() + '</name>';
                xml += '        </employeeModel>';
            }
            xml += '        </employeeListModel>';
            xml += '    </departmentModel>';
        }
        xml += '    </departmentListModel>';
        
        return xml;
    },

    /**
     * 部署リストモデルをデフォルト値から生成する。
     * @return {DepartmentListModel}
     */
    createDepartmentListModelFromDefault: function () {

        var empInDev = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInSales = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInGeneral = new EmployeeListModel(GuidUtil.createGuid(), []);

        var devDeptModel = new DepartmentModel(GuidUtil.createGuid(), '開発部', empInDev);
        var salesDeptModel = new DepartmentModel(GuidUtil.createGuid(), '営業部', empInSales);
        var generalDeptModel = new DepartmentModel(GuidUtil.createGuid(), '総務部', empInGeneral);

        var departmentModelList = [];
        departmentModelList.push(devDeptModel);
        departmentModelList.push(salesDeptModel);
        departmentModelList.push(generalDeptModel);

        var departmentListModel = new DepartmentListModel(GuidUtil.createGuid(), departmentModelList);

        return departmentListModel;
    },

    /**
     * 部署リストモデルをXMLから生成する。
     * @param {string} xml - XML
     * @return {DepartmentListModel}
     */
    createDepartmentListModelFromXml: function (xml) {

        var $xml = $($.parseXML(xml));

        var $departmentListModelXml = $xml.find('departmentListModel');

        var departmentListModelId = $departmentListModelXml.children('id').text();

        // 部署リストモデル
        var departmentListModel = new DepartmentListModel(departmentListModelId, []);

        var $departmentModelXml = $departmentListModelXml.find('departmentModel');

        $departmentModelXml.each(function () {

            var $deptXml = $(this);
            var departmentId = $deptXml.children('id').text();
            var departmentName = $deptXml.children('name').text();

            var $employeeListModelXml = $deptXml.find('employeeListModel');

            var employeeListModelId = $employeeListModelXml.children('id').text();

            // 部署モデル
            var departmentModel = new DepartmentModel(departmentId, departmentName,
                                                        new EmployeeListModel(employeeListModelId, []));

            // 部署リストに部署を追加
            departmentListModel.departmentModelList.push(departmentModel);

            var $employeeModelXml = $employeeListModelXml.find('employeeModel');

            $employeeModelXml.each(function () {

                var $empXml = $(this);

                var employeeId = $empXml.children('id').text();
                var employeeName = $empXml.children('name').text();

                // 部署に社員を追加
                departmentModel.addEmployee(employeeId, employeeName);
            });

        });

        return departmentListModel;
    }
}

