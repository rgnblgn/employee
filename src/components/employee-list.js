import { store, employeeSlice } from "./employee-app.js";
import { connect } from 'lit-redux-watch';
import { LitElement, html, css } from 'lit';

class EmployeeList extends connect(store)(LitElement) {
  static properties = {
    employees: { type: Array },
    selectedEmployee: { type: Object }
  };

  constructor() {
    super();
    this.selectedEmployee = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.employees) {
      this.employees = store.getState().employees;
    }
    store.subscribe(() => this.stateChanged(store.getState()));
  }

  stateChanged(state) {
    this.employees = state.employees;
    this.requestUpdate();
  }

  editEmployee(employee) {
    this.selectedEmployee = { ...employee };
    window.location.href = "/edit"
  }

  deleteEmployee(id) {
    store.dispatch(employeeSlice.actions.deleteEmployee(id));
  }

  render() {
    return html`
      <h3>Employee List</h3>
      <table class="employee-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of Employment</th>
            <th>Date of Birth</th>
            <th>Phone Number </th>
            <th>Email Address </th>
            <th>Department</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          ${this.employees.map(emp => html`
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
                <button class="edit-button" @click=${() => this.editEmployee(emp)}>Düzenle</button>
                <button class="delete-button" @click=${() => this.deleteEmployee(emp.id)}>Sil</button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }

  static styles = css`
    .employee-table {
      width: 100%;
      border-collapse: collapse;
    }
    .employee-table th, .employee-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .employee-table th {
      background-color: #f4f4f4;
    }
    .employee-actions button {
      margin-left: 5px;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
    }
    .edit-button {
      background-color: orange;
      color: white;
    }
    .delete-button {
      background-color: red;
      color: white;
    }
  `;
}

customElements.define('employee-list', EmployeeList);
