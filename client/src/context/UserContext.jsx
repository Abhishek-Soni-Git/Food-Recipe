// // src/contexts/UserContext.js
// import React, { createContext, useState, useContext } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(null); // Set this to "user" or "chef" after login/signup

//   return (
//     <UserContext.Provider value={{ userRole, setUserRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
