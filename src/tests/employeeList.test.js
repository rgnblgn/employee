// Mock tanımları
jest.mock('../helper/helper.js', () => ({
  translate: (key) => key
}));

jest.mock('lit-redux-watch', () => ({
  connect: () => (baseClass) => baseClass
}));

// Mock employee-app modülü
jest.mock('../components/employee-app', () => {
  const { configureStore, createSlice } = require('@reduxjs/toolkit');
  
  const slice = createSlice({
    name: 'employees',
    initialState: [],
    reducers: {
      addEmployee: (state, action) => {
        if (Array.isArray(action.payload)) {
          return action.payload;
        }
        state.push({ ...action.payload, id: state.length + 1 });
      },
      editEmployee: (state, action) => {
        const { index, data } = action.payload;
        state[index] = { ...state[index], ...data };
      },
      deleteEmployee: (state, action) => {
        return state.filter(emp => emp.id !== action.payload);
      }
    }
  });

  const store = configureStore({
    reducer: {
      employees: slice.reducer
    }
  });

  return {
    employeeSlice: slice,
    store
  };
});

const { store, employeeSlice } = require('../components/employee-app');

describe('EmployeeList Tests', () => {
  let element;

  beforeEach(() => {
    if (!customElements.get('employee-list')) {
      require('../components/employee-list.js');
    }

    element = document.createElement('employee-list');
    document.body.appendChild(element);
    return element.updateComplete;
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.clearAllMocks();
    store.dispatch(employeeSlice.actions.addEmployee([]));
  });

  test('should render empty table initially', async () => {
    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table).toBeTruthy();
    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });

  test('should render employee data correctly', async () => {
    const testEmployee = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      employmentDate: '2024-01-01',
      birthDate: '1990-01-01',
      phone: '1234567890',
      email: 'john@example.com',
      department: 'IT',
      position: 'Developer'
    };

    store.dispatch(employeeSlice.actions.addEmployee(testEmployee));
    await element.updateComplete;

    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('John');
    expect(cells[1].textContent).toBe('Doe');
    expect(cells[2].textContent).toBe('2024-01-01');
    expect(cells[3].textContent).toBe('1990-01-01');
    expect(cells[4].textContent).toBe('1234567890');
    expect(cells[5].textContent).toBe('john@example.com');
    expect(cells[6].textContent).toBe('IT');
    expect(cells[7].textContent).toBe('Developer');
  });

  test('should handle pagination correctly', async () => {
    // 11 çalışan ekle (bir sayfadan fazla)
    for (let i = 0; i < 11; i++) {
      store.dispatch(employeeSlice.actions.addEmployee({
        id: i,
        name: `Employee ${i}`,
        surname: 'Doe',
        position: 'Developer'
      }));
    }
    await element.updateComplete;

    // İlk sayfada 10 çalışan olmalı
    let rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);

    // Sayfa düğmeleri kontrol et
    const paginationButtons = element.shadowRoot.querySelectorAll('.pagination button');
    expect(paginationButtons.length).toBe(2); // 2 sayfa olmalı

    // İkinci sayfaya geç
    paginationButtons[1].click();
    await element.updateComplete;

    // İkinci sayfada 1 çalışan olmalı
    rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
  });

  test('should handle delete employee', async () => {
    const testEmployee = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      position: 'Developer'
    };

    store.dispatch(employeeSlice.actions.addEmployee(testEmployee));
    await element.updateComplete;

    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    expect(deleteButton).toBeTruthy();

    deleteButton.click();
    await element.updateComplete;

    const rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });

  test('should handle edit navigation', async () => {
    const testEmployee = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      position: 'Developer'
    };

    store.dispatch(employeeSlice.actions.addEmployee(testEmployee));
    await element.updateComplete;

    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    const editButton = element.shadowRoot.querySelector('.edit-button');
    expect(editButton).toBeTruthy();

    editButton.click();
    
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/edit/1');
    expect(dispatchEventSpy).toHaveBeenCalled();
    expect(element.selectedEmployee).toEqual(testEmployee);

    pushStateSpy.mockRestore();
    dispatchEventSpy.mockRestore();
  });

  test('should update when store changes', async () => {
    // Store'a çalışan ekle
    store.dispatch(employeeSlice.actions.addEmployee({
      id: 1,
      name: 'John',
      surname: 'Doe'
    }));
    await element.updateComplete;

    let rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);

    // Store'dan çalışanı sil
    store.dispatch(employeeSlice.actions.deleteEmployee(1));
    await element.updateComplete;

    rows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).toBe(0);
  });
}); 