import React, { Component, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from '../../../api/axios';

export default function SuperAdminMainPage() {
    const options = {
        method: 'GET',
        url: 'https://drug-info-and-price-history.p.rapidapi.com/1/druginfo',
        params: {drug: 'telmisartan'},
        headers: {
          'X-RapidAPI-Key': 'a01f99be40mshda5728a99cf7da8p1b9fa3jsndee8ef30ebd2',
          'X-RapidAPI-Host': 'drug-info-and-price-history.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
          console.log(response.data);
      }).catch(function (error) {
          console.error(error);
      });
    return <div>
        {/* <h1>Super Admin Works!</h1> */}
    <Suspense fallback={<CircularProgress />}>
            <Routes>
                <Route path="/" element={<h1>Super Admin Works!</h1>} />
            </Routes>
    </Suspense>
</div>;
}