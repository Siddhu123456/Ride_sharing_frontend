import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffers, respondOffer } from "../../../store/driverSlice";
import OfferCard from "../components/OfferCard";
import "./DriverOffers.css";

const DriverOffers = () => {
  const dispatch = useDispatch();
  const { offers } = useSelector((s) => s.driver);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  if (offers.length === 0) {
    return <div className="driver-empty">Waiting for trip offers…</div>;
  }

  return offers.map((o) => (
    <OfferCard
      key={o.attempt_id}
      offer={o}
      onAccept={() =>
        dispatch(respondOffer({ attemptId: o.attempt_id, accept: true }))
      }
      onReject={() =>
        dispatch(respondOffer({ attemptId: o.attempt_id, accept: false }))
      }
    />
  ));
};

export default DriverOffers;
