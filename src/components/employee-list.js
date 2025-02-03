import { store, employeeSlice } from "./employee-app.js";
import { connect } from 'lit-redux-watch';
import { LitElement, html, css } from 'lit';
import { translate } from "../helper/helper.js"

class EmployeeList extends connect(store)(LitElement) {
  static properties = {
    employees: { type: Array },
    selectedEmployee: { type: Object },
    currentPage: { type: Number },
    employeesPerPage: { type: Number },
    store: { type: Object }
  };

  constructor() {
    super();
    this.selectedEmployee = null;
    this.currentPage = 1;
    this.employeesPerPage = 10;
    this.store = store;
    this.employees = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.employees = this.store.getState().employees || [];
    this.unsubscribe = this.store.subscribe(() => {
      this.stateChanged(this.store.getState());
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  stateChanged(state) {
    this.employees = state.employees || [];
    this.requestUpdate();
  }

  editEmployee(employee) {
    this.selectedEmployee = { ...employee };
    window.history.pushState({}, '', "/edit/"+this.selectedEmployee.id);
    window.dispatchEvent(new Event('popstate'));
  }

  deleteEmployee(id) {
    this.store.dispatch(employeeSlice.actions.deleteEmployee(id));
  }

  // ✅ Sayfa değiştirme fonksiyonları
  goToPage(page) {
    this.currentPage = page;
  }

  get paginatedEmployees() {
    const startIndex = (this.currentPage - 1) * this.employeesPerPage;
    return this.employees.slice(startIndex, startIndex + this.employeesPerPage);
  }

  renderPagination() {
    const totalPages = Math.ceil(this.employees.length / this.employeesPerPage);
    return html`
      <div class="pagination">
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => html`
          <button 
            class="${this.currentPage === page ? 'active' : ''}" 
            @click=${() => this.goToPage(page)}>
            ${page}
          </button>
        `)}
      </div>
    `;
  }

  render() {
    return html`
      <h3>Employee List</h3>
      <table class="employee-table">
        <thead>
          <tr>
            <th>${translate("firstName")}</th>
            <th>${translate("lastName")}</th>
            <th>${translate("doe")}</th>
            <th>${translate("dob")}</th>
            <th>${translate("tphone")}</th>
            <th>${translate("temail")}</th>
            <th>${translate("department")}</th>
            <th>${translate("position")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${this.paginatedEmployees.map(emp => html`
            <tr class="employee-item">
              <td>${emp.name}</td>
              <td>${emp.surname}</td>
              <td>${emp.employmentDate}</td>
              <td>${emp.birthDate}</td>
              <td>${emp.phone}</td>
              <td>${emp.email}</td>
              <td>${emp.department}</td>
              <td>${emp.position}</td>
              <td class="employee-actions">
                <button class="edit-button" @click=${() => this.editEmployee(emp)}>${translate("edit")}</button>
                <button class="delete-button" @click=${() => this.deleteEmployee(emp.id)}>${translate("delete")}</button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
      
      ${this.renderPagination()}
    `;
  }

  static styles = css`
    .employee-table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .employee-table th, .employee-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .employee-table th {
       background-color:rgb(230, 157, 0);
      color: white;
      font-weight: bold;
      text-transform: uppercase;
    }

    .employee-item:hover {
      background-color: #f9f9f9;
    }

    .employee-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .employee-actions button {
      padding: 8px 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: 0.3s;
    }

    .edit-button {
      background-color: #f0ad4e;
      color: white;
    }

    .edit-button:hover {
      background-color: #ec971f;
    }

    .delete-button {
      background-color: #d9534f;
      color: white;
    }

    .delete-button:hover {
      background-color: #c9302c;
    }

    /* ✅ Pagination CSS */
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }

    .pagination button {
      margin: 5px;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-size: 0.9rem;
      border-radius: 5px;
      background-color: #007bff;
      color: white;
      transition: 0.3s;
    }

    .pagination button:hover {
      background-color: #0056b3;
    }

    .pagination button.active {
      background-color: #0056b3;
      font-weight: bold;
    }

    /* ✅ Responsive için */
    @media (max-width: 768px) {
      .employee-table {
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }

      .employee-actions {
        flex-direction: column;
        align-items: center;
      }

      .employee-actions button {
        width: 100%;
      }
    }
  `;
}

customElements.define('employee-list', EmployeeList);
