import { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, registerCustomer, googleLogin, resetPassword, deleteMyAccount, getMe } from '../utils/api';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('paj_customer_token');
    const raw = localStorage.getItem('paj_customer');
    if (!token || !raw) {
      setLoading(false);
      return;
    }
    try { setCustomer(JSON.parse(raw)); } catch { /* corrupt cache, ignore */ }

    // Refresh from the server rather than trusting the cached blob forever —
    // it may predate fields added since the session was created, and the
    // token itself may have been invalidated elsewhere (password reset on
    // another device, account deleted) since it was last cached.
    getMe()
      .then(({ data }) => {
        localStorage.setItem('paj_customer', JSON.stringify(data));
        setCustomer(data);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const persist = (token, customerData) => {
    localStorage.setItem('paj_customer_token', token);
    localStorage.setItem('paj_customer', JSON.stringify(customerData));
    setCustomer(customerData);
  };

  const login = async (email, password) => {
    const { data } = await loginCustomer(email, password);
    persist(data.token, data.customer);
  };

  const register = async (name, email, password) => {
    const { data } = await registerCustomer(name, email, password);
    persist(data.token, data.customer);
  };

  const loginWithGoogle = async credential => {
    const { data } = await googleLogin(credential);
    persist(data.token, data.customer);
  };

  const logout = () => {
    localStorage.removeItem('paj_customer_token');
    localStorage.removeItem('paj_customer');
    setCustomer(null);
  };

  const completePasswordReset = async (token, password) => {
    const { data } = await resetPassword(token, password);
    persist(data.token, data.customer);
  };

  const deleteAccount = async password => {
    await deleteMyAccount(password);
    logout();
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, login, register, loginWithGoogle, logout, completePasswordReset, deleteAccount, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomerAuth = () => useContext(CustomerAuthContext);
