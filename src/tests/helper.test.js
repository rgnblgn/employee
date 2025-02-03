describe('Helper Functions Tests', () => {
  let originalLang;

  beforeEach(() => {
    // Orijinal dil değerini sakla
    originalLang = document.documentElement.lang;
    // Her test için dili İngilizce'ye ayarla
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    // Test sonrası orijinal dil değerini geri yükle
    document.documentElement.lang = originalLang;
    jest.resetModules(); // Her test sonrası modül cache'ini temizle
  });

  test('should translate to English by default', () => {
    document.documentElement.lang = '';
    const { translate } = require('../helper/helper.js');

    expect(translate('name')).toBe('Name');
    expect(translate('surname')).toBe('Surname');
    expect(translate('employeeList')).toBe('Employee List');
    expect(translate('addEmployee')).toBe('Add Employee');
    expect(translate('editEmployee')).toBe('Edit Employee');
  });

  test('should translate to Turkish when language is set to tr', () => {
    document.documentElement.lang = 'tr';
    const { translate } = require('../helper/helper.js');

    expect(translate('name')).toBe('Ad');
    expect(translate('surname')).toBe('Soyad');
    expect(translate('employeeList')).toBe('Çalışan Listesi');
    expect(translate('addEmployee')).toBe('Çalışan Ekle');
    expect(translate('editEmployee')).toBe('Çalışan Düzenle');
  });

  test('should return key if translation not found', () => {
    const { translate } = require('../helper/helper.js');
    const nonExistentKey = 'nonExistentKey';

    expect(translate(nonExistentKey)).toBe(nonExistentKey);
  });

  test('should handle all English translations', () => {
    document.documentElement.lang = 'en';
    const { translate } = require('../helper/helper.js');

    const expectedTranslations = {
      employeeList: "Employee List",
      addEmployee: "Add Employee",
      editEmployee: "Edit Employee",
      name: "Name",
      surname: "Surname",
      phone: "Phone",
      save: "Save",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      selectionDepartment: "Select Department",
      selectionPosition: "Select Position",
      firstName: "First Name",
      lastName: "Last Name",
      doe: "Date of Employment",
      dob: "Date of Birth",
      tphone: "Phone Number",
      temail: "Email Address",
      department: "Department",
      position: "Position"
    };

    Object.entries(expectedTranslations).forEach(([key, value]) => {
      expect(translate(key)).toBe(value);
    });
  });

  test('should handle all Turkish translations', () => {
    document.documentElement.lang = 'tr';
    const { translate } = require('../helper/helper.js');

    const expectedTranslations = {
      employeeList: "Çalışan Listesi",
      addEmployee: "Çalışan Ekle",
      editEmployee: "Çalışan Düzenle",
      name: "Ad",
      surname: "Soyad",
      phone: "Telefon",
      save: "Kaydet",
      add: "Ekle",
      edit: "Düzenle",
      delete: "Sil",
      selectionDepartment: "Departman Seçiniz",
      selectionPosition: "Pozisyon Seçiniz",
      firstName: "İsim",
      lastName: "Soyisim",
      doe: "İşe Giriş Tarihi",
      dob: "Doğum Tarihi",
      tphone: "Telefon Numarası",
      temail: "Email Adresi",
      department: "Departman",
      position: "Pozisyon"
    };

    Object.entries(expectedTranslations).forEach(([key, value]) => {
      expect(translate(key)).toBe(value);
    });
  });

  test('should handle language change during runtime', () => {
    const { translate } = require('../helper/helper.js');
    
    // İngilizce test
    document.documentElement.lang = 'en';
    expect(translate('name')).toBe('Name');
    
    // Türkçe'ye geçiş
    document.documentElement.lang = 'tr';
    expect(translate('name')).toBe('Ad');
    
    // Tekrar İngilizce'ye geçiş
    document.documentElement.lang = 'en';
    expect(translate('name')).toBe('Name');
  });

  test('should handle undefined or null language gracefully', () => {
    const { translate } = require('../helper/helper.js');
    
    // Dil undefined olduğunda
    delete document.documentElement.lang;
    expect(translate('name')).toBe('Name'); // Varsayılan olarak İngilizce

    // Dil null olduğunda
    document.documentElement.lang = null;
    expect(translate('name')).toBe('Name');
  });
}); 