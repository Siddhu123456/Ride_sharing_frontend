import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDriverDocStatus,
  fetchCurrentShift,
} from "../../../store/driverSlice";

import DriverDocuments from "./DriverDocuments";
import DriverShift from "./DriverShift";
import DriverOffers from "./DriverOffers";

import "./DriverDashboard.css";

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { docStatus, shift } = useSelector((s) => s.driver);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchDriverDocStatus());
    dispatch(fetchCurrentShift(user.user_id));
  }, [dispatch, user.user_id]);

  if (!docStatus || !docStatus.all_uploaded) return <DriverDocuments />;
  if (!docStatus.all_approved)
    return <div className="driver-pending">Documents under review</div>;

  if (!shift || shift.status === "OFFLINE") return <DriverShift />;

  return <DriverOffers />;
};

export default DriverDashboard;
