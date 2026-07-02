import React, { useEffect, useState } from "react";

const STORAGE_KEY = "tpv_02_form_data";

const emptyItemRow = {
  billItemNo: "",
  description: "",
  unit: "",
  agreementBoqQty: "",
  previousBilledQty: "",
  uptoDateQty: "",
  qtyVerifiedAtSite: "",
  basis: "",
  qualityStatus: "",
  variance: "",
  remarks: "",
};

const emptyData = {
  plantId: "",
  districtPhase: "",
  runningBillNo: "",
  ipcMbReference: "",
  billHeadNo: "",
  boqType: "",
  plantLocation: "",
  items: Array.from({ length: 12 }, () => ({ ...emptyItemRow })),
};

export default function TPV_02_Report({ data }) {
  const [reportData, setReportData] = useState(data || emptyData);

  useEffect(() => {
    if (data) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setReportData({ ...emptyData, ...JSON.parse(saved) });
      } catch (error) {
        console.error("Unable to read TPV-02 saved draft:", error);
      }
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 text-gray-950 print:bg-white print:p-0">
      <div className="mx-auto mb-4 flex max-w-7xl justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          Print TPV-02 Report
        </button>
      </div>

      <main className="mx-auto max-w-7xl bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        <ReportHeader
          title="TPV-02: IPC / BOQ ITEM VERIFICATION SHEET"
          subtitle="Plant-wise Verification against Running Bill / IPC / BOQ / MB"
          note="For use by Third Party Validation (TPV) teams conducting field verification of PSPA water filtration plants."
        />

        <ReportSection title="A. Header Information">
          <TwoColumnTable
            rows={[
              ["Plant ID / Code", reportData.plantId, "District / Phase", reportData.districtPhase],
              ["Running Bill No.", reportData.runningBillNo, "IPC / MB Reference", reportData.ipcMbReference],
              ["Bill Head No.", reportData.billHeadNo, "BOQ / Non-BOQ / VO", reportData.boqType],
              ["Plant Location", reportData.plantLocation, "", ""],
            ]}
          />
        </ReportSection>

        <ReportSection title="B. Item-wise Verification">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] border-collapse text-xs">
              <thead>
                <tr>
                  {[
                    "Bill No. / Item No.",
                    "Description",
                    "Unit",
                    "Agreement / BOQ Qty",
                    "Prev. Billed Qty",
                    "Upto-date Qty",
                    "Qty Verified at Site",
                    "Basis",
                    "Quality / Status",
                    "Variance",
                    "Remarks",
                  ].map((heading) => (
                    <Cell key={heading} label>
                      {heading}
                    </Cell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.items.map((item, index) => (
                  <tr key={index}>
                    <Cell>{item.billItemNo}</Cell>
                    <Cell>{item.description}</Cell>
                    <Cell>{item.unit}</Cell>
                    <Cell>{item.agreementBoqQty}</Cell>
                    <Cell>{item.previousBilledQty}</Cell>
                    <Cell>{item.uptoDateQty}</Cell>
                    <Cell>{item.qtyVerifiedAtSite}</Cell>
                    <Cell>{item.basis}</Cell>
                    <Cell>{item.qualityStatus}</Cell>
                    <Cell>{item.variance}</Cell>
                    <Cell>{item.remarks}</Cell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>

        <ReportSection title="C. Quick Verification Codes">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr>
                <Cell label>Verification Basis</Cell>
                <Cell>Count / Measure / Record</Cell>
              </tr>
              <tr>
                <Cell label>Quality / Status</Cell>
                <Cell>OK = acceptable; DEF = defective; MIS = missing; RPV = record partly verifiable; NV = not verifiable</Cell>
              </tr>
              <tr>
                <Cell label>Variance</Cell>
                <Cell>Difference between Upto-date Qty / Current IPC Qty and quantity physically verified at site</Cell>
              </tr>
              <tr>
                <Cell label>BOQ / Non-BOQ / VO</Cell>
                <Cell>Tick or state whether item falls under original BOQ, non-BOQ, or variation order</Cell>
              </tr>
              <tr>
                <Cell label>TPV Note</Cell>
                <Cell>Any major discrepancy should be supported with photographs, measurements, and brief remarks.</Cell>
              </tr>
            </tbody>
          </table>
        </ReportSection>

        <div className="mt-10 grid grid-cols-2 gap-8 text-sm">
          <Signature label="Inspector Signature" />
          <Signature label="Cross-check / Reviewer" />
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

function Cell({ children, label = false }) {
  return (
    <td className={`border border-gray-400 px-2 py-2 align-top ${label ? "bg-gray-100 font-bold" : ""}`}>
      {children || <span className="text-gray-400">________________</span>}
    </td>
  );
}

function Signature({ label }) {
  return (
    <div>
      <div className="mb-1 min-h-8 border-b border-gray-950 px-2 pb-1" />
      <p className="font-semibold">{label}</p>
    </div>
  );
}
