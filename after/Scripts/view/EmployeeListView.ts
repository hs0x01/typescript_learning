/**
 * 社員リストのビューロジックです。
 */
class EmployeeListView {

    /**
     * 初期化します。
     */
    static init(): void {

        new EmployeeCrudViewModel((viewModel: EmployeeCrudViewModel) => {

            let employeeModelList = viewModel.employeeListViewModel.employeeListModel().employeeModelList;

            employeeModelList.subscribe(() => {
                setTimeout(() => {
                    $('.employee-list-view tbody').animate({ opacity: 1 }, 1000);
                }, 10);
            });
            
            employeeModelList.valueHasMutated();

            ko.applyBindings(viewModel);
        });
    }
}
