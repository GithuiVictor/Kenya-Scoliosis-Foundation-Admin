class Project {
    static addProject(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        axios.post(`/projects`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Successfully added project');
                Project.getProjects();
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static updateProject(form, projectId) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        axios.put(`/projects/${projectId}`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Project has been updated successfully')
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static getProjects() {
        $('.loading-overlay').show();
        axios.get(`/projects`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const projectsContainer = $('.projects');
                projectsContainer.empty();

                const projectsSelect = $('#projects-select');
                projectsSelect.empty();
                response.data.forEach(project => {
                    projectsContainer.append(projectCard(project));

                    //add options for expenses
                    projectsSelect.append(`<option value="${project.id}">${project.name}</option>`);
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getProjectDetails(projectId) {
        $('.loading-overlay').show();
        axios.get(`/projects/${projectId}`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const project = response.data;
                $('.project-name').text(project.name).val(project.name);
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static addProjectTask(form, projectId) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        axios.post(`/projects/${projectId}/tasks`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Successfully added task to this project');
                Project.getProjectTasks(projectId);
                form[0].reset();
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getProjectTasks(projectId) {
        $('.loading-overlay').show();
        axios.get(`/projects/${projectId}/tasks`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const tasksContainer = $('#tasks-container');
                tasksContainer.empty();
                response.data.forEach(task => {
                    tasksContainer.append(taskTemplate(task));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static addProjectExpense(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        data = formDataToJson(data);
        const projectId = $('#projects-select').val();
        axios.post(`/projects/${projectId}/expenses`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Successfully added expense.');
                Project.getExpenses();
                form[0].reset();
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getExpenses() {
        $('.loading-overlay').show();
        axios.get(`/expenses`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const pendingExpensesContainer = $('#pending-expenses-container');
                pendingExpensesContainer.empty();
                const approvedExpensesContainer = $('#approved-expenses-container');
                approvedExpensesContainer.empty();
                response.data.forEach(expense => {
                    if (expense.status === 'complete')
                        approvedExpensesContainer.append(approvedExpenseTemplate(expense));
                    else
                        pendingExpensesContainer.append(pendingExpenseTemplate(expense));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('project');

const projectForm = $('#project-form');
projectForm.on('submit', (e) => {
    e.preventDefault();
    Project.addProject(projectForm);
});

const updateProjectForm = $('#update-project-form');
updateProjectForm.on('submit', (e) => {
    e.preventDefault();
    Project.updateProject(updateProjectForm, projectId);
});

const taskForm = $('#task-form');
taskForm.on('submit', (e) => {
    e.preventDefault();
    Project.addProjectTask(taskForm, projectId);
});

const expenseForm = $('#expense-form');
expenseForm.on('submit', (e) => {
    e.preventDefault();
    Project.addProjectExpense(expenseForm);
});

$(document).ready(() => {
    Project.getProjects();

    if (projectId) {
        Project.getProjectDetails(projectId);
        Project.getProjectTasks(projectId);
    }
});

const projectCard = (project) => {
    return `
        <div class="d-flex justify-content-between project">
            <a href="adminProjectDetails.html?project=${project.id}" class="w-100 mr-5">
                <h5 class="mb-3">${project.name}</h5>
                <div class="progress mb-4" style="height: 20px;">
                    <div class="progress-bar progress-bar-striped font-weight-bold bg-success"
                         data-progress="90%"></div>
                </div>
            </a>
            <div class="text-right mt-3">
                <button type="button" class="btn btn-success"
                        onclick="">Complete
                </button>
            </div>
        </div>
    `;
};

const taskTemplate = (task) => {
    return `
    <div class="container-fluid bg-white">
        <div class="row py-3 mb-4 task-border align-item-center">

            <div class="col-2">
                <input type="checkbox">
            </div>

            <div class="col-sm-9 col-8">
                ${task.name}
            </div>

            <div class="col-1">
                <button type="button" class="btn btn-sm" data-toggle="modal"
                        data-toggle="tooltip" data-target="#deleteTask"
                        title="delete" data-html="true"
                        data-placement="top">
                    <i class="fas fa-trash-alt fa-lg text-danger"></i>
                </button>
            </div>
        </div>
    </div>
`;
};

const pendingExpenseTemplate = (expense) => {
    return `
        <tr>
            <td>${expense.name}</td>
            <td>${expense.project.name}</td>
            <td>KES ${expense.amount}</td>
            <td>${moment(expense.createdAt).format('MMMM Do YYYY h:mm a')}</td>
            <td>
                <button class="btn btn-danger btn-sm text-center approveBtn"
                        onclick="">Approve
                </button>
            </td>
            <td>
                <button type="button" class="btn btn-sm" data-toggle="modal"
                        data-toggle="tooltip" data-target="#deleteExpense"
                        title="delete" data-html="true"
                        data-placement="top">
                    <i class="fas fa-trash-alt fa-lg text-danger"></i>
                </button>
            </td>
        </tr>
    `;
};

const approvedExpenseTemplate = (expense) => {
    return `
        <tr>
            <td>${expense.name}</td>
            <td>${expense.project.name}</td>
            <td>KES ${expense.amount}</td>
            <td>${moment(expense.createdAt).format('MMMM Do YYYY h:mm a')}</td>
            <td>
                <span class="badge badge-success w-75 py-2">Approved</span>
            </td>
        </tr>
    `;
};
