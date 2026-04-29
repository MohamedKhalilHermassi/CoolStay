
export const getConnected = () => {
    return localStorage.getItem('connected');
  };
  
  export const setConnected = (value) => {
    localStorage.setItem('connected', value);
  };