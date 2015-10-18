describe('社員CRUDビューモデル', () => {

    var employeeCrudViewModel: EmployeeCrudViewModel = null;

    beforeEach((done) => {

        spyOn(DepartmentRepository, 'findDepartmentAll').and.callFake((callback: Function) => {

            var departmentModelList: Array<DepartmentModel> = [];

            departmentModelList.push(new DepartmentModel('d1', 'システム開発部', new EmployeeListModel('el1', [])));
            departmentModelList.push(new DepartmentModel('d2', '営業部', new EmployeeListModel('el2', [])));

            var departmentListModel: DepartmentListModel = new DepartmentListModel('dl1', departmentModelList);

            callback(departmentListModel);
        });

        new EmployeeCrudViewModel((viewModel: EmployeeCrudViewModel) => {

            employeeCrudViewModel = viewModel;

            done();
        });
    });

    describe('すべての部署と所属する社員を保存する', () => {

        it('すべての部署と所属する社員が、サーバーに保存される', () => {

            spyOn(DepartmentRepository, 'saveDepartmentAll').and.callFake((departmentListModel: DepartmentListModel, callback: Function) => {

                expect(departmentListModel.id()).toBe('dl1');
                expect(departmentListModel.departmentModelList().length).toBe(2);

                callback();
            });
            
            employeeCrudViewModel.saveDepartmentAll();
        });
    });
});
