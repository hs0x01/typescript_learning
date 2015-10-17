/**
 * 部署モデルのリポジトリです。
 */
class DepartmentRepository {

    /**
     * ローカルストレージキーです。
     */
    private static LOCAL_STORAGE_KEY: string = 'sample.all-department-model';

    /**
     * すべての部署モデルを返します。
     * <p>
     * すべての部署モデル(<code>DepartmentListModel</code>)は、コールバック関数の引数として返します。
     * </p>
     * @param callback コールバック関数
     */
    static findDepartmentAll (callback: Function) {

        var departmentListModel: DepartmentListModel = null;

        var item = localStorage.getItem(this.LOCAL_STORAGE_KEY);

        if (item === null) {
            departmentListModel = this.createDepartmentListModelFromDefault();
        } else {
            departmentListModel = this.createDepartmentListModelFromXml(item);
        }

        // サーバーへのAjax通信を想定してコールバック
        callback(departmentListModel);
    }

    /**
     * すべての部署モデルを保存します。
     * <p>現在、ローカルストレージに保存しています。</p>
     * <p>保存完了は、コールバック関数を呼び出すことにより通知します。</p>
     * @param departmentListModel 部署リストモデル
     * @param callback コールバック関数
     */
    static saveDepartmentAll(departmentListModel: DepartmentListModel, callback: Function) {

        var xml: string = this.createDepartmentListModelXml(departmentListModel);
        
        localStorage.setItem(this.LOCAL_STORAGE_KEY, xml);

        // サーバーへのAjax通信を想定してコールバック
        callback();
    }

    /**
     * 部署リストモデルのXMLデータを生成します。
     * @param departmentListModel 部署リストモデル
     * @return 部署リストモデルのXMLデータ
     */
    static createDepartmentListModelXml(departmentListModel: DepartmentListModel): string {

        var xml: string = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';

        var departmentModelList: Array<DepartmentModel> = departmentListModel.departmentModelList();

        for (var i = 0; i < departmentModelList.length; i++) {
            var departmentModel: DepartmentModel = departmentModelList[i];

            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';

            var employeeListModel: EmployeeListModel = departmentModel.employeeListModel();

            xml += '            <id>' + employeeListModel.id() + '</id>';

            var employeeModelList: Array<EmployeeModel> = employeeListModel.employeeModelList();

            for (var j = 0; j < employeeModelList.length; j++) {
                var employeeModel: EmployeeModel = employeeModelList[j];

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
    }

    /**
     * 部署リストモデルをデフォルト値から生成します。
     * @return 部署モデルリスト
     */
    static createDepartmentListModelFromDefault(): DepartmentListModel {

        var empInDev: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInSales: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);
        var empInGeneral: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);

        var devDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '開発部', empInDev);
        var salesDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '営業部', empInSales);
        var generalDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '総務部', empInGeneral);

        var departmentModelList: Array<DepartmentModel> = [];
        departmentModelList.push(devDeptModel);
        departmentModelList.push(salesDeptModel);
        departmentModelList.push(generalDeptModel);

        var departmentListModel: DepartmentListModel = new DepartmentListModel(GuidUtil.createGuid(), departmentModelList);

        return departmentListModel;
    }

    /**
     * 部署リストモデルをXMLから生成します。
     * @param xml XML
     * @return 部署リストモデル
     */
    static createDepartmentListModelFromXml(xml: string): DepartmentListModel {

        var $xml: JQuery = $($.parseXML(xml));

        var $departmentListModelXml: JQuery = $xml.find('departmentListModel');

        var departmentListModelId: string = $departmentListModelXml.children('id').text();

        // 部署リストモデル
        var departmentListModel: DepartmentListModel = new DepartmentListModel(departmentListModelId, []);

        var $departmentModelXml: JQuery = $departmentListModelXml.find('departmentModel');

        $departmentModelXml.each(function () {

            var $deptXml: JQuery = $(this);
            var departmentId: string = $deptXml.children('id').text();
            var departmentName: string = $deptXml.children('name').text();

            var $employeeListModelXml: JQuery = $deptXml.find('employeeListModel');

            var employeeListModelId: string = $employeeListModelXml.children('id').text();

            // 部署モデル
            var departmentModel: DepartmentModel = new DepartmentModel(departmentId, departmentName,
                                                        new EmployeeListModel(employeeListModelId, []));

            // 部署リストに部署を追加
            departmentListModel.departmentModelList.push(departmentModel);

            var $employeeModelXml: JQuery = $employeeListModelXml.find('employeeModel');

            $employeeModelXml.each(function () {

                var $empXml: JQuery = $(this);

                var employeeId: string = $empXml.children('id').text();
                var employeeName: string = $empXml.children('name').text();

                // 部署に社員を追加
                departmentModel.addEmployee(employeeId, employeeName);
            });

        });

        return departmentListModel;
    }
}

