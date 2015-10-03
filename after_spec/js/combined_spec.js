/// <reference path="../../../after/js/combined.d.ts" />
describe('部署モデル', function () {
    var departmentModel = null;
    beforeEach(function () {
        var employeeModelList = [];
        var employeeListModel = new EmployeeListModel('1', employeeModelList);
        // テスト対象
        departmentModel = new DepartmentModel('1', 'システム開発部', employeeListModel);
    });
    describe('社員を部署に追加する', function () {
        it('社員IDと社員名を指定すると、社員が部署に追加される', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            var employeeModel = employeeModelList[0];
            expect(employeeModel.id()).toBe('1');
            expect(employeeModel.name()).toBe('テスト　太郎');
            expect(employeeModel.departmentModel()).toBe(departmentModel);
        });
    });
    describe('社員を部署から削除する', function () {
        it('指定した社員IDの社員が削除される', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            departmentModel.deleteEmployee('1');
            expect(employeeModelList.length).toBe(0);
        });
        it('指定した社員IDの社員でなければ、削除されない', function () {
            departmentModel.addEmployee('1', 'テスト　太郎');
            var employeeModelList = departmentModel.employeeListModel().employeeModelList();
            expect(employeeModelList.length).toBe(1);
            departmentModel.deleteEmployee('2');
            expect(employeeModelList.length).toBe(1);
        });
    });
});
/// <reference path="../../../after/js/combined.d.ts" />
describe('社員CRUDビューモデル', function () {
    var employeeCrudViewModel = null;
    beforeEach(function (done) {
        spyOn(DepartmentRepository, 'findDepartmentAll').and.callFake(function (callback) {
            var departmentModelList = [];
            departmentModelList.push(new DepartmentModel('d1', 'システム開発部', new EmployeeListModel('el1', [])));
            departmentModelList.push(new DepartmentModel('d2', '営業部', new EmployeeListModel('el2', [])));
            var departmentListModel = new DepartmentListModel('dl1', departmentModelList);
            callback(departmentListModel);
        });
        new EmployeeCrudViewModel(function (viewModel) {
            employeeCrudViewModel = viewModel;
            done();
        });
    });
    describe('すべての部署と所属する社員を保存する', function () {
        it('すべての部署と所属する社員が、サーバーに保存される', function () {
            spyOn(DepartmentRepository, 'saveDepartmentAll').and.callFake(function (departmentListModel, callback) {
                expect(departmentListModel.id()).toBe('dl1');
                expect(departmentListModel.departmentModelList().length).toBe(2);
                callback();
            });
            employeeCrudViewModel.saveDepartmentAll();
        });
    });
});
