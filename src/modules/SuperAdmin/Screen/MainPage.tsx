// import React, { Component, Suspense, lazy, useState } from 'react';
// import { Routes, Route, Navigate } from "react-router-dom";
// import CircularProgress from "@mui/material/CircularProgress";
// import axios from '../../../api/axios';
// import NotFoundPage from "../../errorpages/404.tsx";
// import { getSideBarData, menu } from "../Data/super-sidebar.ts";
// import { useAuth } from "../../hooks/useAuth";


// export default function SuperAdminMainPage() {
//     const [user, setUser] = useAuth();
//     const menus = getSideBarData();
//     return <div>
//     <div>
//         {user}
//         <div className='super-sidebar'>
//             {menus.map((menu : menu) : any => 
//                 <div className="super-menu" key={menu.name}>
//                     {menu.name}
//                 </div>
//             )}
//         </div>
//     </div>
//     <div>
//         <Suspense fallback={<CircularProgress />}>
//             <Routes>
//                 <Route path="/home" element={<h1>Super Admin Works!</h1>} />
//                 <Route path='/*' element={<NotFoundPage />} />
//             </Routes>
//         </Suspense>
//     </div>
// </div>;
// }