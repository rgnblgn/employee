import { LitElement, html, css } from 'lit';
import {store,employeeSlice} from "./employee-app.js"

class EmployeeEdit extends LitElement {
    static properties = {
      employee: { type: Object }
    };
  
    constructor() {
      super();
      this.employee = null;
    }
  
    updated(changedProperties) {
      if (changedProperties.has('employee') && this.employee) {
        this.requestUpdate();
      }
    }
  
    updateField(field, value) {
      this.employee = { ...this.employee, [field]: value };
    }
  
    saveChanges() {
      store.dispatch(employeeSlice.actions.editEmployee({ id: this.employee.id, updatedEmployee: this.employee }));
      this.employee = null;

    }

    connectedCallback() {
        super.connectedCallback();
        this.employee = null; // Bileşen her açıldığında sıfırla
    }
  
    render() {
      if (!this.employee) return html``;
  
      return html`
        <h2>Edit Employee</h2>
        <input type="text" placeholder="Name" .value=${this.employee.name} @input=${e => this.updateField('name', e.target.value)}>
        <input type="text" placeholder="Surname" .value=${this.employee.surname} @input=${e => this.updateField('surname', e.target.value)}>
        <input type="text" placeholder="Date of Employment" .value=${this.employee.employmentDate} @input=${e => this.updateField('employmentDate', e.target.value)}>
        <input type="text" placeholder="Date of Birth" .value=${this.employee.birthDate} @input=${e => this.updateField('birthDate', e.target.value)}>
        <input type="tel" placeholder="Phone Number" .value=${this.employee.phone} @input=${e => this.updateField('phone', e.target.value)}>
        <input type="email" placeholder="Email Address" .value=${this.employee.email} @input=${e => this.updateField('email', e.target.value)}>
        <input type="text" placeholder="Department" .value=${this.employee.department} @input=${e => this.updateField('department', e.target.value)}>
        <input type="text" placeholder="Position" .value=${this.employee.position} @input=${e => this.updateField('position', e.target.value)}>

        <button @click=${this.saveChanges}>Save</button>
      `;
    }
  }
  customElements.define('employee-edit', EmployeeEdit);
  