import { store, employeeSlice } from "./employee-app.js";
import { connect } from 'lit-redux-watch';
import { LitElement, html, css } from 'lit';
import { translate } from "../helper/helper.js"

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
    window.history.pushState({}, '', "/edit/"+this.selectedEmployee.id);
    window.dispatchEvent(new Event('popstate'));
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
            <th>${translate("firstName")}</th>
            <th>${translate("lastName")}</th>
            <th>${translate("doe")}</th>
            <th>${translate("dob")}</th>
            <th>${translate("tphone")}</th>
            <th>${translate("temail")}</th>
            <th>${translate("department")}</th>
            <th>${translate("position")}</th>
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
                <button class="edit-button" @click=${() => this.editEmployee(emp)}>${translate("edit")}</button>
                <button class="delete-button" @click=${() => this.deleteEmployee(emp.id)}>${translate("delete")}</button>
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
