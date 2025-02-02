import { LitElement, html, css } from 'lit';
import { store, employeeSlice } from "./employee-app.js";

class EmployeeAdd extends LitElement {
    static properties = {
      newEmployee: { type: Object },
      errors: { type: Object }
    };
  
    constructor() {
      super();
      this.newEmployee = { name: '', surname: '', phone: '', email: '', dob: '', doe: '', department: '', position: '' };
      this.errors = {};
    }
  
    validateInputs() {
      this.errors = {};
      if (!/^[0-9]+$/.test(this.newEmployee.phone)) {
        this.errors.phone = "Phone number must contain only numbers.";
      }
      if (!this.newEmployee.email.includes('@')) {
        this.errors.email = "Email must contain '@' character.";
      }
      if (!this.newEmployee.birthDate) {
        this.errors.dob = "Date of Birth is required.";
      }
      if (!this.newEmployee.employmentDate) {
        this.errors.doe = "Date of Employment is required.";
      }
      if (!this.newEmployee.department) {
        this.errors.department = "Department must be selected.";
      }
      if (!this.newEmployee.position) {
        this.errors.position = "Position must be selected.";
      }
      return Object.keys(this.errors).length === 0;
    }
  
    updateNewEmployee(field, value) {
      this.newEmployee = { ...this.newEmployee, [field]: value };
    }
  
    addEmployee() {
      if (!this.validateInputs()) {
        this.requestUpdate();
        return;
      }
      store.dispatch(employeeSlice.actions.addEmployee(this.newEmployee));
      this.newEmployee = { name: '', surname: '', phone: '', email: '', birthDate: '', employmentDate: '', department: '', position: '' };
      this.errors = {};
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    }
  
    render() {
      return html`
        <h2>Add Employee</h2>
        <input type="text" placeholder="Name" .value=${this.newEmployee.name} @input=${e => this.updateNewEmployee('name', e.target.value)}>
        <input type="text" placeholder="Surname" .value=${this.newEmployee.surname} @input=${e => this.updateNewEmployee('surname', e.target.value)}>
        <input type="text" placeholder="Phone" class="${this.errors.phone ? 'error' : ''}" .value=${this.newEmployee.phone} @input=${e => this.updateNewEmployee('phone', e.target.value)}>
        ${this.errors.phone ? html`<p class="error-text">${this.errors.phone}</p>` : ''}
        <input type="email" placeholder="Email" class="${this.errors.email ? 'error' : ''}" .value=${this.newEmployee.email} @input=${e => this.updateNewEmployee('email', e.target.value)}>
        ${this.errors.email ? html`<p class="error-text">${this.errors.email}</p>` : ''}
        <input type="date" .value=${this.newEmployee.birthDate} @input=${e => this.updateNewEmployee('birthDate', e.target.value)}>
        <input type="date" .value=${this.newEmployee.employmentDate} @input=${e => this.updateNewEmployee('employmentDate', e.target.value)}>
        <select @change=${e => this.updateNewEmployee('department', e.target.value)}>
          <option value="">Select Department</option>
          <option value="Analytics">Analytics</option>
          <option value="Tech">Tech</option>
        </select>
        <select @change=${e => this.updateNewEmployee('position', e.target.value)}>
          <option value="">Select Position</option>
          <option value="Junior">Junior</option>
          <option value="Medior">Medior</option>
          <option value="Senior">Senior</option>
        </select>
        <button @click=${this.addEmployee} >Add</button>
      `;
    }

    static styles = css`
      .error {
        border: 2px solid red;
      }
      .error-text {
        color: red;
        font-size: 12px;
      }
    `;
  }
  
  customElements.define('employee-add', EmployeeAdd);
