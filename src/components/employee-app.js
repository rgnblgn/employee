import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { translate} from "../helper/helper.js"
import "./employee-list.js"
import "./employee-add.js"

const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
  const response = await fetch('/data/employees.json');
  const jsonEmployees = await response.json();
  
  const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
  if(storedEmployees.length) {
    return storedEmployees;
  }
  return jsonEmployees;
});

export const employeeSlice = createSlice({
  name: 'employees',
  initialState: JSON.parse(localStorage.getItem('employees')) || [],
  reducers: {
    addEmployee: (state, action) => {
      const newEmployee = { id: Date.now(), ...action.payload }
      state.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(state));
    },
    editEmployee: (state, action) => {
      const { index, data } = action.payload;
      const newState = [...state];
      newState[index] = data;
      localStorage.setItem('employees', JSON.stringify(newState));
      return newState;
    },
    deleteEmployee: (state, action) => {
      const updatedState = state.filter(emp => emp.id !== action.payload);
      localStorage.setItem('employees', JSON.stringify(updatedState));
      return updatedState;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      return action.payload;
    });
  }
});

export const store = configureStore({
  reducer: {
    employees: employeeSlice.reducer
  }
});

class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    nav {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    nav a {
      text-decoration: none;
      color: white;
      background-color: blue;
      padding: 10px;
      border-radius: 5px;
    }
    .employee-list {
      list-style: none;
      padding: 0;
    }
    .employee-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-bottom: 5px;
      background: #f4f4f4;
      border-radius: 5px;
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

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#outlet'));
    router.setRoutes([
      { path: '/', component: 'employee-list' },
      { path: '/add', component: 'employee-add' },
      { path: '/edit/:id', component: 'employee-add' } 
    ]);
    console.log(router.routes);
    store.dispatch(fetchEmployees());
  }

  render() {
    return html`
      <nav>
        <a href="/">${translate("employeeList")}</a>
        <a href="/add">${translate("addEmployee")}</a>
      </nav>
      <div id="outlet"></div>
    `;
  }
}

customElements.define('employee-app', EmployeeApp);
