import React, { Suspense, lazy } from "react";
import {
    Dashboard,
    Receipt,
    Vaccines,
    LocalPharmacy,
    Flag,
    ShoppingBasket,
    People,
    DeliveryDining,
    AttachMoney,
    AdminPanelSettings,
    CheckCircle,
    LocalHospital,
    ContactMail,
  } from "@mui/icons-material";
  import CircularProgress from "@mui/material/CircularProgress";


const DashboardPage = lazy(() => import("../../Screen/Dashboard/Dashboard"));
const Invoice = lazy(() => import("../../Screen/Invoice/NewInvoice"));
const Manager = lazy(() => import("../../Screen/Manager/Manager"));
const MedicinePage = lazy(() => import("../../Screen/Medicine/MedicinePage"));
const PharmacistPage = lazy(() => import("../../Screen/Pharmacist/PharmacistPage"));
const ReportsPage = lazy(() => import("../../Screen/ReportsPage/ReportsPage"));
const DeliveryMenPage = lazy(() =>
  import("../../Screen/DelvieryMenPage/DeliveryMenPage")
);
const SalesReportsPage = lazy(() => import("../../Screen/SalesReport/SalesReportPage"));
const PurchasePage = lazy(() => import("../../Screen/PurchasePage/PurchasePage"));
const SettingsPage = lazy(() => import("../../Screen/SettingsPage/Settings"));
const PharmacistApprovalPage = lazy(() =>
  import("../../Screen/PharmacistApprovalPage/PharmacistApprovalPage")
);
const AssignUserPrevilegesPage = lazy(() =>
  import("../../Screen/AssignUserPrevileges/AssignUserPrevileges")
);
const OrderPickupPage = lazy(() => import("../../Screen/DelvieryMenPage/OrderPickup"));
const SearchMedicines = lazy(() =>
  import("../customer/SearchMedicines.tsx")
);
const ChatWithOrganization = lazy(() => import("../chatWithOrg/ChatWithOrganization.tsx"));

const menuIcons = {
    1 : <Dashboard />,
    2 : <Receipt />,
    3 : <People />,
    4 : <Vaccines />,
    5 : <LocalPharmacy />,
    6 : <DeliveryDining />,
    7 : <AttachMoney />,
    8 : <ShoppingBasket />,
    9 : <Flag />,
    10 : <AdminPanelSettings />,
    11 : <CheckCircle />,
    12 : <CheckCircle />,
    13 : <LocalHospital />,
    14 : <ContactMail />
};

function getMenuIcon(id : number) {
  return menuIcons[id];
}

function contentArea(option : number, user : any) {
  switch (option) {
    case 1:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <DashboardPage />
        </Suspense>
      );
    case 2:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <Invoice />
        </Suspense>
      );
    case 3:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <Manager />
        </Suspense>
      );
    case 4:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <MedicinePage />
        </Suspense>
      );
    case 5:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <PharmacistPage />
        </Suspense>
      );
    case 6:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <DeliveryMenPage />
        </Suspense>
      );
    case 7:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <SalesReportsPage />
        </Suspense>
      );
    case 8:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <PurchasePage username={user.username} />
        </Suspense>
      );
    case 9:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <ReportsPage />
        </Suspense>
      );
    case 10:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <AssignUserPrevilegesPage />
        </Suspense>
      );
    case 11:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <PharmacistApprovalPage />
        </Suspense>
      );
    case 12:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <OrderPickupPage />
        </Suspense>
      );
    case 13:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <SearchMedicines />
        </Suspense>
      );
    case 14:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <ChatWithOrganization  username={user.username} />
        </Suspense>
      );
    case 999:
      return (
        <Suspense fallback={<CircularProgress size={50} />}>
          <SettingsPage username={user.username} />
        </Suspense>
      );
    default:
      return;
  }
};

export {
    getMenuIcon,
    contentArea
}