// ContractorWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ShowTPVProforma from "./ShowTPVProforma";

export default function ContractorWrapper() {
  const { formType } = useParams();

  switch (parseInt(formType, 10)) {
    case 1:
      return <ShowTPVProforma />;
    default:
      return <ShowTPVProforma />;
  }
}
