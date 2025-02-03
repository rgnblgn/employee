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
  
  // Slice'ı yeniden oluştur
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

  // Store'u oluştur
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

describe('EmployeeAdd Tests', () => {
  let element;

  beforeEach(() => {
    // Custom element'i tanımla
    if (!customElements.get('employee-add')) {
      require('../components/employee-add.js');
    }

    element = document.createElement('employee-add');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.clearAllMocks();
    // Store'u sıfırla
    store.dispatch(employeeSlice.actions.addEmployee([]));
  });

  test('should initialize with empty form', () => {
    expect(element.newEmployee).toEqual({
      name: '', 
      surname: '', 
      phone: '', 
      email: '', 
      dob: '', 
      doe: '', 
      department: '', 
      position: ''
    });
    expect(element.employeeIndex).toBe(-1);
    expect(element.errors).toEqual({});
  });

  test('should validate form fields', () => {
    // Geçersiz verilerle test
    element.newEmployee = {
      name: 'John',
      surname: 'Doe',
      phone: 'abc', // geçersiz telefon
      email: 'invalid-email', // geçersiz email
      birthDate: '',
      employmentDate: '',
      department: '',
      position: ''
    };

    element.validateInputs();
    
    expect(element.errors.phone).toBe('Phone number must contain only numbers.');
    expect(element.errors.email).toBe("Email must contain '@' character.");
    expect(element.errors.dob).toBe('Date of Birth is required.');
    expect(element.errors.doe).toBe('Date of Employment is required.');
    expect(element.errors.department).toBe('Department must be selected.');
    expect(element.errors.position).toBe('Position must be selected.');
  });

  test('should add valid employee', () => {
    const validEmployee = {
      name: 'John',
      surname: 'Doe',
      phone: '12345',
      email: 'john@doe.com',
      birthDate: '1990-01-01',
      employmentDate: '2024-01-01',
      department: 'Tech',
      position: 'Senior'
    };

    element.newEmployee = validEmployee;
    
    const pushStateSpy = jest.spyOn(window.history, 'pushState');
    
    element.addEmployee();

    const employees = store.getState().employees;
    expect(employees.length).toBe(1);
    expect(employees[0]).toMatchObject(validEmployee);
    expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/');

    pushStateSpy.mockRestore();
  });

  test('should handle edit mode', () => {
    const existingEmployee = {
      id: 1,
      name: 'John',
      surname: 'Doe',
      phone: '12345',
      email: 'john@doe.com',
      birthDate: '1990-01-01',
      employmentDate: '2024-01-01',
      department: 'Tech',
      position: 'Senior'
    };

    store.dispatch(employeeSlice.actions.addEmployee(existingEmployee));
    
    // Edit modunu simüle et
    Object.defineProperty(window, 'location', {
      value: { pathname: '/edit/1' },
      writable: true
    });

    element.firstUpdated();
    
    // Pozisyonu güncelle
    element.newEmployee = { ...existingEmployee, position: 'Lead' };
    element.addEmployee();

    const updatedEmployee = store.getState().employees[0];
    expect(updatedEmployee.position).toBe('Lead');
  });
}); 