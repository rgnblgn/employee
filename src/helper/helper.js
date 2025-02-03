const translations = {
    en: {
      employeeList: "Employee List",
      addEmployee: "Add Employee",
      editEmployee: "Edit Employee",
      name: "Name",
      surname: "Surname",
      phone: "Phone",
      save: "Save",
      add: "Add",
      edit:"Edit",
      delete:"Delete",
      selectionDepartment:"Select Department",
      selectionPosition:"Select Position",
      firstName : "First Name",
      lastName : "Last Name",
      doe: "Date of Employment",
      dob :"Date of Birth",
      tphone : "Phone Number",
      temail : "Email Address",
      department : "Department",
      position :"Position"
    },
    tr: {
      employeeList: "Çalışan Listesi",
      addEmployee: "Çalışan Ekle",
      editEmployee: "Çalışan Düzenle",
      name: "Ad",
      surname: "Soyad",
      phone: "Telefon",
      save: "Kaydet",
      add: "Ekle",
      edit:"Düzenle",
      delete:"Sil",
      selectionDepartment:"Departman Seçiniz",
      selectionPosition:"Pozisyon Seçiniz",    
      firstName : "İsim",
      lastName : "Soyisim",
      doe: "İşe Giriş Tarihi",
      dob :"Doğum Tarihi",
      tphone : "Telefon Numarası",
      temail : "Email Adresi",
      department : "Departman",
      position :"Pozisyon"   
    }
  };
  
  const getCurrentLang = () => {
    const lang = document.documentElement.lang;
    // Geçerli bir dil değeri yoksa 'en' döndür
    return (lang && translations[lang]) ? lang : 'en';
  };

  export const translate = (key) => {
    const lang = getCurrentLang();
    return translations[lang][key] || key;
  };