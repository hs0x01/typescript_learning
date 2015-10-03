/// <reference path="../../../after/js/combined.d.ts" />

describe('部署モデル', () => {

    var departmentModel: DepartmentModel = null;

    beforeEach(() => {

        var employeeModelList: Array<EmployeeModel> = [];

        var employeeListModel: EmployeeListModel = new EmployeeListModel('1', employeeModelList);

        // テスト対象
        departmentModel = new DepartmentModel('1', 'システム開発部', employeeListModel);
    });

    describe('社員を部署に追加する', () => {

        it('社員IDと社員名を指定すると、社員が部署に追加される', () => {

            departmentModel.addEmployee('1', 'テスト　太郎');

            var employeeModelList: Array<EmployeeModel> = departmentModel.employeeListModel().employeeModelList();

            expect(employeeModelList.length).toBe(1);

            var employeeModel: EmployeeModel = employeeModelList[0];

            expect(employeeModel.id()).toBe('1');
            expect(employeeModel.name()).toBe('テスト　太郎');
            expect(employeeModel.departmentModel()).toBe(departmentModel);
        });
    });

    describe('社員を部署から削除する', () => {

        it('指定した社員IDの社員が削除される', () => {

            departmentModel.addEmployee('1', 'テスト　太郎');

            var employeeModelList: Array<EmployeeModel> = departmentModel.employeeListModel().employeeModelList();

            expect(employeeModelList.length).toBe(1);

            departmentModel.deleteEmployee('1');

            expect(employeeModelList.length).toBe(0);
        });

        it('指定した社員IDの社員でなければ、削除されない', () => {

            departmentModel.addEmployee('1', 'テスト　太郎');

            var employeeModelList: Array<EmployeeModel> = departmentModel.employeeListModel().employeeModelList();

            expect(employeeModelList.length).toBe(1);

            departmentModel.deleteEmployee('2');

            expect(employeeModelList.length).toBe(1);
        });

    });
});
