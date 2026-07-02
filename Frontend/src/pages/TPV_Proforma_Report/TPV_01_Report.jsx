import React, { useEffect, useState } from "react";

const STORAGE_KEY = "tpv_01_form_data";

const physicalCheckItems = [
  "Major process equipment present",
  "Site clean and generally usable",
  "No major leakage / visible damage",
  "Water point / taps usable",
  "Civil structure / room / shed acceptable",
  "Drainage / wastewater disposal acceptable",
  "Operator available / O&M evident",
  "Plant appears to serve public",
];

const recordCheckItems = [
  "O&M log",
  "Maintenance / repair record",
  "Water quality report",
  "Complaint register",
  "Plant handover / rehabilitation record",
];

const emptyData = {
  district: "",
  dateOfVisit: "",
  tehsilUc: "",
  plantId: "",
  plantLocation: "",
  phase: "",
  inspectorName: "",
  contractorRepPresent: "",
  operatorCaretakerPresent: "",
  gpsAppEntry: "",
  plantType: "",
  plantTypeOther: "",
  capacity: "",
  operatingAtVisit: "",
  waterAvailableToPublic: "",
  overallStatus: "",
  physicalChecks: physicalCheckItems.map((item) => ({ item, status: "", remarks: "" })),
  recordChecks: recordCheckItems.map((record) => ({ record, status: "", remarks: "" })),
  serviceDelivery: "",
  omCompliance: "",
  recommendation: "",
  majorObservations: "",
  inspectorSignature: "",
  siteRepresentativeSignature: "",
};

export default function TPV_01_Report({ data }) {
  const [reportData, setReportData] = useState(data || emptyData);

  useEffect(() => {
    if (data) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setReportData({ ...emptyData, ...JSON.parse(saved) });
      } catch (error) {
        console.error("Unable to read TPV-01 saved draft:", error);
      }
    }
  }, [data]);

  const plantType =
    reportData.plantType === "Other" && reportData.plantTypeOther
      ? `Other: ${reportData.plantTypeOther}`
      : reportData.plantType;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 text-gray-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-5xl justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          Print TPV-01 Report
        </button>
      </div>

      <main className="mx-auto max-w-5xl bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <ReportHeader
          title="TPV-01: PLANT VISIT, FUNCTIONALITY & QUALITY PROFORMA"
          subtitle="Punjab Saaf Pani Authority (PSPA) – Water Filtration Plants"
          note="For use by Third Party Validation (TPV) teams conducting field verification of PSPA water filtration plants."
        />

        <ReportSection title="A. Basic Information">
          <TwoColumnTable
            rows={[
              ["District", reportData.district, "Date of Visit", reportData.dateOfVisit],
              ["Tehsil / UC", reportData.tehsilUc, "Plant ID / Code", reportData.plantId],
              ["Plant Location", reportData.plantLocation, "Phase", reportData.phase],
              ["Inspector Name", reportData.inspectorName, "Contractor Rep Present", reportData.contractorRepPresent],
              ["Operator / Caretaker Present", reportData.operatorCaretakerPresent, "GPS / App Entry", reportData.gpsAppEntry],
            ]}
          />
        </ReportSection>

        <ReportSection title="B. Plant Status">
          <TwoColumnTable
            rows={[
              ["Plant Type", plantType, "Capacity", reportData.capacity],
              ["Operating at time of visit", reportData.operatingAtVisit, "Water available to public", reportData.waterAvailableToPublic],
              ["Overall Status", reportData.overallStatus, "", ""],
            ]}
          />
        </ReportSection>

        <ReportSection title="C. Quick Physical / Quality Check">
          <StatusReportTable
            firstColumnLabel="Item"
            rows={reportData.physicalChecks}
            rowLabelKey="item"
            statusOptions={["OK", "Not OK"]}
          />
        </ReportSection>

        <ReportSection title="D. Record Check">
          <StatusReportTable
            firstColumnLabel="Record"
            rows={reportData.recordChecks}
            rowLabelKey="record"
            statusOptions={["Available", "Not Available"]}
          />
        </ReportSection>

        <ReportSection title="E. Overall Assessment">
          <TwoColumnTable
            rows={[
              ["Service Delivery", reportData.serviceDelivery, "O&M Compliance", reportData.omCompliance],
              ["Recommendation", reportData.recommendation, "", ""],
            ]}
          />

          <div className="mt-4">
            <p className="mb-1 text-sm font-bold">Major Observations</p>
            <div className="min-h-24 whitespace-pre-wrap border border-gray-400 p-3 text-sm">
              {valueOrLine(reportData.majorObservations)}
            </div>
          </div>
        </ReportSection>

        <div className="mt-10 grid grid-cols-2 gap-8 text-sm">
          <Signature label="Inspector Signature" value={reportData.inspectorSignature} />
          <Signature label="Site Representative Signature" value={reportData.siteRepresentativeSignature} />
        </div>
      </main>
    </div>
  );
}

function ReportHeader({ title, subtitle, note }) {
  return (
    <header className="mb-6 border-b-2 border-gray-950 pb-4 text-center">
      <h1 className="text-xl font-bold uppercase">{title}</h1>
      <p className="mt-1 text-base font-semibold">{subtitle}</p>
      <p className="mt-2 text-sm text-gray-700">{note}</p>
    </header>
  );
}

function ReportSection({ title, children }) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h2 className="mb-2 bg-gray-950 px-3 py-2 text-sm font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function TwoColumnTable({ rows }) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <Cell label>{row[0]}</Cell>
            <Cell>{row[1]}</Cell>
            <Cell label>{row[2]}</Cell>
            <Cell>{row[3]}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusReportTable({ rows, firstColumnLabel, rowLabelKey, statusOptions }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <Cell label>{firstColumnLabel}</Cell>
          {statusOptions.map((option) => (
            <Cell key={option} label center>{option}</Cell>
          ))}
          <Cell label>Remarks</Cell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[rowLabelKey]}>
            <Cell>{row[rowLabelKey]}</Cell>
            {statusOptions.map((option) => (
              <Cell key={option} center>
                <Check checked={row.status === option} />
              </Cell>
            ))}
            <Cell>{row.remarks}</Cell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cell({ children, label = false, center = false }) {
  return (
    <td
      className={[
        "border border-gray-400 px-2 py-2 align-top",
        label ? "bg-gray-100 font-bold" : "",
        center ? "text-center" : "",
      ].join(" ")}
    >
      {children || <span className="text-gray-400">________________</span>}
    </td>
  );
}

function Check({ checked }) {
  return <span className="text-base">{checked ? "☑" : "☐"}</span>;
}

function Signature({ label, value }) {
  return (
    <div>
      <div className="mb-1 min-h-8 border-b border-gray-950 px-2 pb-1">{value}</div>
      <p className="font-semibold">{label}</p>
    </div>
  );
}

function valueOrLine(value) {
  return value || "____________________________________________________________________________________________";
}
