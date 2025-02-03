const { configureStore } = require('@reduxjs/toolkit');
const { employeeSlice, employeeActions } = require('../components/employee-app');

describe('Employee Store Tests', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        employees: employeeSlice.reducer
      }
    });
  });

  test('initial state should be empty array', () => {
    const state = store.getState().employees;
    expect(Array.isArray(state)).toBe(true);
    expect(state.length).toBe(0);
  });

  test('should add new employee', () => {
    const newEmployee = {
      name: 'John Doe',
      position: 'Developer'
    };

    store.dispatch(employeeSlice.actions.addEmployee(newEmployee));
    
    const state = store.getState().employees;
    expect(state.length).toBe(1);
    expect(state[0].name).toBe('John Doe');
    expect(state[0].position).toBe('Developer');
  });

  test('should delete employee', () => {
    const employee = {
      name: 'Jane Doe',
      position: 'Manager'
    };
    
    store.dispatch(employeeSlice.actions.addEmployee(employee));
    const state = store.getState().employees;
    const employeeId = state[0].id;
    
    store.dispatch(employeeSlice.actions.deleteEmployee(employeeId));
    const newState = store.getState().employees;
    
    expect(newState.length).toBe(0);
  });

  test('should edit employee', () => {
    const employee = {
      name: 'Bob Smith',
      position: 'Designer'
    };
    
    store.dispatch(employeeSlice.actions.addEmployee(employee));
    
    const updatedData = {
      name: 'Bob Smith Jr',
      position: 'Senior Designer'
    };
    
    store.dispatch(employeeSlice.actions.editEmployee({
      index: 0,
      data: updatedData
    }));
    
    const updatedState = store.getState().employees;
    expect(updatedState[0].name).toBe('Bob Smith Jr');
    expect(updatedState[0].position).toBe('Senior Designer');
  });

  
});
