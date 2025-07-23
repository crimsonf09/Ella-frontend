import {useState} from 'react';
import {login, logout} from '../api/auth.ts'
export function useAuth (){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = async() =>{
        const result = await login();
        setIsLoggedIn(typeof result === 'boolean' ? result : false);
    }
    const handleLogout = async() =>{
        await logout();
        setIsLoggedIn(false);
    }
  return { isLoggedIn, login, logout: handleLogout };
    


}