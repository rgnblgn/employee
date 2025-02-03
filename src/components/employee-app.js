import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { translate} from "../helper/helper.js"
import "./employee-list.js"
import "./employee-add.js"
import {sharedStyles} from "../style/style.js"

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
 

  static styles = [sharedStyles];

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
