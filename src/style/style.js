import { css } from "lit";

export const sharedStyles = css`
 :host {
    display: block;
    font-family: "Arial", sans-serif;
    padding: 20px;
    margin: auto;
  }
  
  /* Navbar */
  nav {
    display: flex;
    justify-content: center;
    gap: 15px;
    background-color:rgb(230, 157, 0);
    padding: 10px;
    border-radius: 8px;
  }
  
  nav a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background 0.3s;
  }
  
  nav a:hover {
    background-color: #005bb5;
  }
  
  /* Employee List */
  h3 {
    text-align: center;
    color: #333;
  }
  
  .employee-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
    padding: 10px;
  }
  
  .employee {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .employee:hover {
    transform: scale(1.03);
  }
  
  /* Form Styling */
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
     background-color:rgb(230, 157, 0);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:hover {
    background: #005bb5;
  }
  
  /* Responsive Design */
  @media (max-width: 600px) {
    .employee-list {
      grid-template-columns: 1fr;
    }
  
    nav {
      flex-direction: column;
      align-items: center;
    }
  }
  
`;
