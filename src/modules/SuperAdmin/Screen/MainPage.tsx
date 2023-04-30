import React, { Component, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from '../../../api/axios';

export default function SuperAdminMainPage() {
    return <div>
        {/* <h1>Super Admin Works!</h1> */}
    <Suspense fallback={<CircularProgress />}>
            <Routes>
                <Route path="/" element={<h1>Super Admin Works!</h1>} />
            </Routes>
    </Suspense>
</div>;
}