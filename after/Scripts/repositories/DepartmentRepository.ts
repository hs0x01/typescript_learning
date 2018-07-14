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
        
        let departmentListModel: DepartmentListModel = null;

        let item = localStorage.getItem(this.LOCAL_STORAGE_KEY);

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

        let xml: string = this.createDepartmentListModelXml(departmentListModel);
        
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

        let xml: string = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '    <departmentListModel>';
        xml += '        <id>' + departmentListModel.id() + '</id>';

        let departmentModelList: Array<DepartmentModel> = departmentListModel.departmentModelList();

        for (let i = 0; i < departmentModelList.length; i++) {
            let departmentModel: DepartmentModel = departmentModelList[i];

            xml += '    <departmentModel>';
            xml += '        <id>' + departmentModel.id() + '</id>';
            xml += '        <name>' + departmentModel.name() + '</name>';
            xml += '        <employeeListModel>';

            let employeeListModel: EmployeeListModel = departmentModel.employeeListModel();

            xml += '            <id>' + employeeListModel.id() + '</id>';

            let employeeModelList: Array<EmployeeModel> = employeeListModel.employeeModelList();

            for (let j = 0; j < employeeModelList.length; j++) {
                let employeeModel: EmployeeModel = employeeModelList[j];

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

        let empInDev: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);
        let empInSales: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);
        let empInGeneral: EmployeeListModel = new EmployeeListModel(GuidUtil.createGuid(), []);

        let devDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '開発部', empInDev);
        let salesDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '営業部', empInSales);
        let generalDeptModel: DepartmentModel = new DepartmentModel(GuidUtil.createGuid(), '総務部', empInGeneral);

        let departmentModelList: Array<DepartmentModel> = [];
        departmentModelList.push(devDeptModel);
        departmentModelList.push(salesDeptModel);
        departmentModelList.push(generalDeptModel);

        let departmentListModel: DepartmentListModel = new DepartmentListModel(GuidUtil.createGuid(), departmentModelList);

        return departmentListModel;
    }

    /**
     * 部署リストモデルをXMLから生成します。
     * @param xml XML
     * @return 部署リストモデル
     */
    static createDepartmentListModelFromXml(xml: string): DepartmentListModel {

        let $xml: JQuery<XMLDocument> = $($.parseXML(xml));

        let $departmentListModelXml: JQuery<XMLDocument> = $xml.find('departmentListModel');

        let departmentListModelId: string = $departmentListModelXml.children('id').text();

        // 部署リストモデル
        let departmentListModel: DepartmentListModel = new DepartmentListModel(departmentListModelId, []);

        let $departmentModelXml: JQuery<XMLDocument> = $departmentListModelXml.find('departmentModel');

        $departmentModelXml.each(function () {

            let $deptXml: JQuery<XMLDocument> = $(this);
            let departmentId: string = $deptXml.children('id').text();
            let departmentName: string = $deptXml.children('name').text();

            let $employeeListModelXml: JQuery<XMLDocument> = $deptXml.find('employeeListModel');

            let employeeListModelId: string = $employeeListModelXml.children('id').text();

            // 部署モデル
            let departmentModel: DepartmentModel = new DepartmentModel(departmentId, departmentName,
                                                        new EmployeeListModel(employeeListModelId, []));

            // 部署リストに部署を追加
            departmentListModel.departmentModelList.push(departmentModel);

            let $employeeModelXml: JQuery<XMLDocument> = $employeeListModelXml.find('employeeModel');

            $employeeModelXml.each(function () {

                let $empXml: JQuery<XMLDocument> = $(this);

                let employeeId: string = $empXml.children('id').text();
                let employeeName: string = $empXml.children('name').text();

                // 部署に社員を追加
                departmentModel.addEmployee(employeeId, employeeName);
            });

        });

        return departmentListModel;
    }
}

