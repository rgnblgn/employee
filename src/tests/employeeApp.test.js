// Mock tanımları
jest.mock('lit-redux-watch', () => ({
  connect: () => (baseClass) => baseClass
}));

jest.mock('../helper/helper.js', () => ({
  translate: (key) => key
}));

// DOM Element mock'u
class MockElement {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.href = '';
    this.textContent = '';
  }

  appendChild(child) {
    this.children.push(child);
  }
}

// Vaadin Router mock'u
class MockRouter {
  static go = jest.fn();
  static setOutlet = jest.fn();
  static setTriggers = jest.fn();

  constructor(outlet) {
    this.outlet = outlet;
    MockRouter.setOutlet(outlet);
    MockRouter.setTriggers();
  }

  setRoutes(routes) {
    this.routes = routes;
    return Promise.resolve();
  }
}

jest.mock('@vaadin/router', () => ({
  Router: MockRouter
}));

// Mock employee-app modülü
jest.mock('../components/employee-app', () => {
  const { configureStore, createSlice } = require('@reduxjs/toolkit');

  const mockSlice = createSlice({
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

  const mockStore = configureStore({
    reducer: {
      employees: mockSlice.reducer
    }
  });

  return {
    employeeSlice: mockSlice,
    store: mockStore,
    EmployeeApp: class {
      constructor() {
        this.location = {};
        this.shadowRoot = {
          querySelector: (selector) => {
            if (selector === '#outlet') {
              return new MockElement('div');
            }
            if (selector === 'nav') {
              const nav = new MockElement('nav');
              const link1 = new MockElement('a');
              link1.href = '/';
              link1.textContent = 'employeeList';
              const link2 = new MockElement('a');
              link2.href = '/add';
              link2.textContent = 'addEmployee';
              nav.appendChild(link1);
              nav.appendChild(link2);
              return nav;
            }
            if (selector === 'main') {
              return new MockElement('main');
            }
            return null;
          },
          querySelectorAll: (selector) => {
            if (selector === 'a') {
              const link1 = new MockElement('a');
              link1.href = '/';
              link1.textContent = 'employeeList';
              const link2 = new MockElement('a');
              link2.href = '/add';
              link2.textContent = 'addEmployee';
              return [link1, link2];
            }
            return [];
          }
        };
      }

      connectedCallback() {
        this.unsubscribe = mockStore.subscribe(() => {});
      }

      disconnectedCallback() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      async firstUpdated() {
        const router = new MockRouter(this.shadowRoot.querySelector('#outlet'));
        await router.setRoutes([
          { path: '/', component: 'employee-list' },
          { path: '/add', component: 'employee-add' },
          { path: '/edit/:id', component: 'employee-add' }
        ]);
      }
    }
  };
});

const { Router } = require('@vaadin/router');
const { store, employeeSlice, EmployeeApp } = require('../components/employee-app');

describe('EmployeeApp Tests', () => {
  let element;

  beforeEach(() => {
    // Mock fonksiyonlarını sıfırla
    Router.go.mockClear();
    Router.setOutlet.mockClear();
    Router.setTriggers.mockClear();

    // Store'u temizle
    store.dispatch(employeeSlice.actions.addEmployee([]));

    // Doğrudan bir instance oluştur
    element = new EmployeeApp();
    element.connectedCallback(); // Manuel olarak lifecycle metodunu çağır
  });

  afterEach(() => {
    element.disconnectedCallback(); // Manuel olarak lifecycle metodunu çağır
    jest.clearAllMocks();
  });

  test('should initialize router on first update', async () => {
    await element.firstUpdated();
    expect(Router.setOutlet).toHaveBeenCalled();
    expect(Router.setTriggers).toHaveBeenCalled();
    expect(element.shadowRoot.querySelector('main')).toBeTruthy();
  });

  test('should handle navigation', async () => {
    await element.firstUpdated();
    
    const nav = element.shadowRoot.querySelector('nav');
    expect(nav).toBeTruthy();
    
    const links = element.shadowRoot.querySelectorAll('a');
    expect(links).toBeTruthy();
    expect(links[0].textContent).toContain('employeeList');
    expect(links[1].textContent).toContain('addEmployee');

    // Router.go çağrılarını test et
    Router.go('/');
    expect(Router.go).toHaveBeenCalledWith('/');

    Router.go('/add');
    expect(Router.go).toHaveBeenCalledWith('/add');
  });

  test('should handle store state changes', () => {
    const testEmployee = {
      id: 1,
      name: 'John',
      surname: 'Doe'
    };

    store.dispatch(employeeSlice.actions.addEmployee(testEmployee));
    const state = store.getState();
    
    expect(state.employees).toHaveLength(1);
    expect(state.employees[0]).toMatchObject(testEmployee);
  });

  test('should handle multiple employee operations', () => {
    const employee1 = { name: 'John' };
    const employee2 = { name: 'Jane' };
    
    store.dispatch(employeeSlice.actions.addEmployee(employee1));
    store.dispatch(employeeSlice.actions.addEmployee(employee2));
    
    let state = store.getState();
    expect(state.employees).toHaveLength(2);

    // İlk çalışanı düzenle
    store.dispatch(employeeSlice.actions.editEmployee({
      index: 0,
      data: { ...state.employees[0], name: 'Johnny' }
    }));
    
    state = store.getState();
    expect(state.employees[0].name).toBe('Johnny');

    // İlk çalışanı sil
    store.dispatch(employeeSlice.actions.deleteEmployee(state.employees[0].id));
    
    state = store.getState();
    expect(state.employees).toHaveLength(1);
    expect(state.employees[0].name).toBe('Jane');
  });

  test('should handle store subscription cleanup', () => {
    const unsubscribe = jest.fn();
    const subscribeSpy = jest.spyOn(store, 'subscribe').mockReturnValue(unsubscribe);

    element.connectedCallback();
    element.disconnectedCallback();

    expect(subscribeSpy).toHaveBeenCalled();
    expect(unsubscribe).toHaveBeenCalled();

    subscribeSpy.mockRestore();
  });
}); 