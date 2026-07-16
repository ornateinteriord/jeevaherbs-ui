import { createContext } from 'react';

const UserContext = createContext({ user: null, getUser: null, setUser: null } as { user: any, getUser: any, setUser: any });

export default UserContext;