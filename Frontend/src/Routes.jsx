import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --------------------------------- Administration ------------------------------------
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// ---------------------------------- Area Management ----------------------------------
import AreaManagement from "./pages/AreaManagement/AreaManagement";
import Province from "./pages/AreaManagement/Province";
import Division from "./pages/AreaManagement/Division";
import District from "./pages/AreaManagement/District";
import Tehsil from "./pages/AreaManagement/Tehsil";
import Zone from "./pages/AreaManagement/Zone";

// ----------------------------------Contractor & Inspector ----------------------------------
import CreateContractor from "./pages/Contractor/CreateContractor";
import CreateInspector from "./pages/Inspector/CreateInspector";
import PJP from "./pages/Contractor/PJP";
import ContractorPlanning from "./pages/Contractor/ContractorPlanning";
import ShowTPVProforma from "./pages/Contractor/ShowTPVProforma";

// ---------------------------------- Inspection ----------------------------------
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateInspectionSite from "./pages/Inspection/CreateInspectionSite";
import InspectionSiteMap from "./pages/Inspection/InspectionSiteMap";

// ---------------------------------- BOQ ----------------------------------
import CreateBOQBill from "./pages/BOQ/CreateBOQBill";
import CreateBOQ from "./pages/BOQ/CreateBOQ";

// ---------------------------------- TPV Proforma ----------------------------------
import TPV_01 from "./pages/TPV_Proforma/TPV_01";
import TPV_02 from "./pages/TPV_Proforma/TPV_02";
import TPV_02A from "./pages/TPV_Proforma/TPV_02A";
import TPV_01_Report from "./pages/TPV_Proforma_Report/TPV_01_Report";
import TPV_02_Report from "./pages/TPV_Proforma_Report/TPV_02_Report";
import TPV_02A_Report from "./pages/TPV_Proforma_Report/TPV_02A_Report";
import ThirdPartyInepection from "./pages/ThirdPartyInspection/ThirdPartyInepection";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* ------------------------------ Area Management ----------------------------- */}
          <Route path="area-management" element={<AreaManagement />} />
          <Route path="province" element={<Province />} />
          <Route path="division" element={<Division />} />
          <Route path="district" element={<District />} />
          <Route path="tehsil" element={<Tehsil />} />
          <Route path="zone" element={<Zone />} />
          <Route path="create-contractor" element={<CreateContractor />} />
          <Route path="create-inspector" element={<CreateInspector />} />
          <Route path="pjp" element={<PJP />} />
          <Route path="contractor-planning" element={<ContractorPlanning />} />
          <Route path="show-tpv-proforma" element={<ShowTPVProforma />} />

          {/* ------------------------------ Inspection ----------------------------- */}
          <Route
            path="create-inspection-site"
            element={<CreateInspectionSite />}
          />
          <Route path="inspection-site-map" element={<InspectionSiteMap />} />

          {/* ------------------------------ BOQ ----------------------------- */}

          <Route path="create-boq-bill" element={<CreateBOQBill />} />
          <Route path="create-boq" element={<CreateBOQ />} />

          {/* ------------------------------ TVP Proforma ----------------------------- */}
        
          <Route path="/tpv-01" element={<TPV_01 />} />
          <Route path="/tpv-02" element={<TPV_02 />} />
          <Route path="/tpv-02a" element={<TPV_02A />} />
          <Route path="/tpv-01-report" element={<TPV_01_Report />} />
          <Route path="/tpv-02-report" element={<TPV_02_Report />} />
          <Route path="/tpv-02a-report" element={<TPV_02A_Report />} />

            {/* ------------------------------ TVP Proforma ----------------------------- */}

            <Route path="/third-party-inspection" element={<ThirdPartyInepection/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
