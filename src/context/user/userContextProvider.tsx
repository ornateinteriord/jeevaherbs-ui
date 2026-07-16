import  { useState } from 'react'
import UserContext from './userContext';
import { get } from '../../api/Api';
import { MemberDetails } from '../../store/store';

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<MemberDetails>()
    

    const getUser = async (userId: string) => {
       return await get(`/user/member/${userId}`)
    };
  

    return (
        <UserContext.Provider value={{ user, getUser , setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider