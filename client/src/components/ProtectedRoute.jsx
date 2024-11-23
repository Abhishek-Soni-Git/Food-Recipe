// // src/components/ProtectedRoute.js
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ element, allowedRoles, userRole }) => {
//   return allowedRoles.includes(userRole) ? (
//     element
//   ) : (
//     <Navigate to="/auth" replace />
//   );
// };

// export default ProtectedRoute;
// // 