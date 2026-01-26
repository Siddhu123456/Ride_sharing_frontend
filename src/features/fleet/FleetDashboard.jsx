import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  checkFleetStatus,
  fetchDocStatus,
  uploadFleetDoc,
  fetchFleetVehicles,
  fetchFleetDrivers,
  clearFleetError,
} from "../../store/fleetSlice";

import DashboardSidebar from "./components/DashboardSidebar";
import DashboardOverview from "./components/DashboardOverview";
import VehicleManager from "./components/VehicleManager";
import DriverManager from "./components/DriverManager";
import AssignmentManager from "./components/AssignmentManager";
import DocUploadModule from "./components/DocUploadModule";
import AddVehicleModal from "./components/AddVehicleModal";

import "./FleetDashboard.css";

const FleetDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { fleet, loading, hasExistingFleet, docStatus, error, successMsg } = useSelector(
    (state) => state.fleet
  );

  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  useEffect(() => {
    dispatch(checkFleetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!fleet?.fleet_id) return;

    // Unverified
    if (fleet.approval_status !== "APPROVED") {
      dispatch(fetchDocStatus(fleet.fleet_id));
      return;
    }

    // Verified
    dispatch(fetchFleetVehicles(fleet.fleet_id));
    dispatch(fetchFleetDrivers(fleet.fleet_id));
  }, [fleet, dispatch]);

  useEffect(() => {
    if (hasExistingFleet === false) navigate("/fleet-registration");
  }, [hasExistingFleet, navigate]);

  if (loading && !fleet) {
    return (
      <div className="fd-screen-loader">
        <div className="rydo-spinner"></div>
      </div>
    );
  }

  // --- ONBOARDING VIEW (UNVERIFIED) ---
  if (fleet && fleet.approval_status !== "APPROVED") {
    return (
      <div className="fd-onboarding-shell">
        <header className="fd-utility-nav">
          <div className="fd-nav-brand">
            Rydo<span>FLEET</span>
          </div>
          <button
            className="fd-nav-logout"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout Account
          </button>
        </header>

        <div className="fd-onboarding-viewport">
          <div className="fd-hero-content">
            <span className="fd-badge-new">Verification Required</span>
            <h1>Command Center Activation</h1>
            <p>
              Welcome, <strong>{fleet.fleet_name}</strong>. Provide your business credentials to
              begin operations.
            </p>

            {(error || successMsg) && (
              <div className={`fd-banner ${error ? "error" : "success"}`}>
                <span>{error || successMsg}</span>
                <button onClick={() => dispatch(clearFleetError())}>✕</button>
              </div>
            )}
          </div>

          <DocUploadModule
            fleetId={fleet.fleet_id}
            docStatus={docStatus}
            dispatch={dispatch}
            uploadAction={uploadFleetDoc}
            approvalStatus={fleet.approval_status}
          />
        </div>
      </div>
    );
  }

  // --- FULL DASHBOARD VIEW (VERIFIED) ---
  return (
    <div className="fd-dashboard-shell">
      <DashboardSidebar
        fleetName={fleet?.fleet_name}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="fd-main-viewport">
        <header className="fd-top-utility-bar">
          <div className="fd-breadcrumb">
            Console / <strong>{activeTab}</strong>
          </div>
          <div className="fd-system-status">
            <span className="fd-dot-active"></span>
            System Operational
          </div>
        </header>

        {(error || successMsg) && (
          <div className={`fd-banner ${error ? "error" : "success"}`}>
            <span>{error || successMsg}</span>
            <button onClick={() => dispatch(clearFleetError())}>✕</button>
          </div>
        )}

        <div className="fd-scrollable-content">
          {activeTab === "OVERVIEW" && (
            <DashboardOverview onAddVehicle={() => setShowAddVehicleModal(true)} />
          )}
          {activeTab === "VEHICLES" && (
            <VehicleManager fleetId={fleet?.fleet_id} onAdd={() => setShowAddVehicleModal(true)} />
          )}
          {activeTab === "DRIVERS" && <DriverManager fleetId={fleet?.fleet_id} />}
          {activeTab === "ASSIGNMENTS" && <AssignmentManager fleetId={fleet?.fleet_id} />}
        </div>
      </main>

      {showAddVehicleModal && (
        <AddVehicleModal fleetId={fleet?.fleet_id} onClose={() => setShowAddVehicleModal(false)} />
      )}
    </div>
  );
};

export default FleetDashboard;
