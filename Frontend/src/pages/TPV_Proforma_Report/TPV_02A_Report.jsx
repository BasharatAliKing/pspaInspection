import React, { useEffect, useState } from "react";

const STORAGE_KEY = "tpv_02a_form_data";

const emptyMeasurementRow = {
  itemNo: "",
  description: "",
  location: "",
  nos: "",
  length: "",
  widthBreadth: "",
  heightDepth: "",
  calculatedQty: "",
  unit: "",
  qtyInBoq: "",
  variance: "",
  qualityCheck: "",
  remarks: "",
};

const qualityParameters = [
  "Excavation / foundation dimensions match",
  "PCC / RCC dimensions acceptable",
  "Brickwork / blockwork line, level, plumb acceptable",
  "Plaster / paint finish acceptable",
  "Floor / tiles laid properly",
  "Doors / windows / ventilators / locks installed",
  "Roof / sandwich panels / sheets properly fixed",
  "Electrical fixtures / wiring / DB / lights installed",
  "Pipe works / trench / drains completed properly",
  "No visible cracks / seepage / unsafe defects",
];

const emptyData = {
  plantId: "",
  districtPhase: "",
  billHeadSubhead: "",
  runningBillIpcRef: "",
  workCategory: "",
  workCategoryOther: "",
  measuredBy: "",
  crossCheckedBy: "",
  measurements: Array.from({ length: 9 }, () => ({ ...emptyMeasurementRow })),
  qualityChecks: qualityParameters.map((parameter) => ({
    parameter,
    status: "",
    remarks: "",
  })),
  finalMeasuredBy: "",
  finalCheckedBy: "",
  date: "",
};

export default function TPV_02A_Report({ data }) {
  const [reportData, setReportData] = useState(data || emptyData);

  useEffect(() => {
    if (data) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setReportData({ ...emptyData, ...JSON.parse(saved) });
      } catch (error) {
        console.error("Unable to read TPV-02A saved draft:", error);
      }
    }
  }, [data]);

  const workCategory =
    reportData.workCategory === "Other" && reportData.workCategoryOther
      ? `Other: ${reportData.workCategoryOther}`
      : reportData.workCategory;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 text-gray-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-7xl justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          Print TPV-02A Report
        </button>
      </div>

      <main className="mx-auto max-w-7xl bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <ReportHeader
          title="TPV-02A: MEASUREMENT SHEET FOR CIVIL / PRE-FAB / PLANT ROOM WORKS"
          subtitle="To be used only where physical measurement is required for quantity verification"
          note="For use by Third Party Validation (TPV) teams conducting field verification of PSPA water filtration plants."
        />

        <ReportSection title="A. Header Information">
          <TwoColumnTable
            rows={[
              ["Plant ID / Code", reportData.plantId, "District / Phase", reportData.districtPhase],
              ["Bill Head / Subhead", reportData.billHeadSubhead, "Running Bill / IPC Ref.", reportData.runningBillIpcRef],
              ["Work Category", workCategory, "", ""],
              ["Measured By", reportData.measuredBy, "Cross-checked By", reportData.crossCheckedBy],
            ]}
          />
        </ReportSection>

        <ReportSection title="B. Measurement Table">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1600px] border-collapse text-xs">
              <thead>
                <tr>
                  {[
                    "Item No.",
                    "Description",
                    "Location",
                    "Nos.",
                    "Length",
                    "Width / Breadth",
                    "Height / Depth",
                    "Calculated Qty",
                    "Unit",
                    "Qty in BOQ",
                    "Variance",
                    "Quality Check",
                    "Remarks",
                  ].map((heading) => (
                    <Cell key={heading} label>
                      {heading}
                    </Cell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.measurements.map((row, index) => (
                  <tr key={index}>
                    <Cell>{row.itemNo}</Cell>
                    <Cell>{row.description}</Cell>
                    <Cell>{row.location}</Cell>
                    <Cell>{row.nos}</Cell>
                    <Cell>{row.length}</Cell>
                    <Cell>{row.widthBreadth}</Cell>
                    <Cell>{row.heightDepth}</Cell>
                    <Cell>{row.calculatedQty}</Cell>
                    <Cell>{row.unit}</Cell>
                    <Cell>{row.qtyInBoq}</Cell>
                    <Cell>{row.variance}</Cell>
                    <Cell>{row.qualityCheck}</Cell>
                    <Cell>{row.remarks}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>

        <ReportSection title="C. Civil / Room / Pre-Fab Quality Check">
          <StatusReportTable rows={reportData.qualityChecks} />
        </ReportSection>

        <div className="mt-10 grid grid-cols-3 gap-8 text-sm">
          <Signature label="Measured By" value={reportData.finalMeasuredBy || reportData.measuredBy} />
          <Signature label="Checked By" value={reportData.finalCheckedBy || reportData.crossCheckedBy} />
          <Signature label="Date" value={reportData.date} />
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

function StatusReportTable({ rows }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <Cell label>Quality Parameter</Cell>
          <Cell label center>OK</Cell>
          <Cell label center>Not OK</Cell>
          <Cell label>Remarks</Cell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.parameter}>
            <Cell>{row.parameter}</Cell>
            <Cell center><Check checked={row.status === "OK"} /></Cell>
            <Cell center><Check checked={row.status === "Not OK"} /></Cell>
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
