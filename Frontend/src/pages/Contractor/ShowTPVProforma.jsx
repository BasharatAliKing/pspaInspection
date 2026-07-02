// ShowTPVProforma.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, Printer, Search } from "lucide-react";
import { useTheme } from "../../components/Layout";
import { useNavbar } from "../../components/Navbar";
import {
  DataTable,
  FieldGrid,
  ReportPageFrame,
  Section,
  contractorApprovalStyles,
  formatDate,
  formatDateTime,
  reportStyles,
  valueOrDash,
} from "./ContractorApprovalLayout";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DUMMY_TPV_RECORDS = [
  {
    id: "TPV-001",
    target_id: "TPV-TGT-001",
    site_no: "SITE-001",
    inspector_name: "INS-001 - Ahmed Khan",
    contractor_name: "ABC Contractor Pvt. Ltd.",
    contractor_code: "CON-001",
    contractor_approval: "Approved",
    final_approval: "Pending",
    is_contractor_approved: true,
    is_admin_approved: false,
    is_approved: false,
    created_at: "2026-06-20T10:30:00",
    updated_at: "2026-06-20T15:20:00",
    tpv01: {
      district: "Swat",
      dateOfVisit: "2026-06-20",
      tehsil: "Babuzai",
      inspection_site: "SITE-001",
      plantLocation: "Mingora Main Road Water Filtration Plant",
      phase: "Phase I",
      inspectorName: "INS-001 - Ahmed Khan",
      contractorRepPresent: "Yes",
      operatorCaretakerPresent: "Yes",
      gpsAppEntry: "Done",
      plant_type: "RO Plant",
      plantTypeOther: "",
      capacity: "1000 LPH",
      operatingAtVisit: "Yes",
      waterAvailableToPublic: "Yes",
      overall_status: "Functional with Minor Issues",
      physicalChecks: [
        { item: "Major process equipment present", status: "OK", remarks: "Installed and visible" },
        { item: "Site clean and generally usable", status: "OK", remarks: "Minor cleaning required" },
        { item: "No major leakage / visible damage", status: "Not OK", remarks: "Small leakage near outlet pipe" },
      ],
      recordChecks: [
        { record: "O&M log", status: "Available", remarks: "Updated till last week" },
        { record: "Maintenance / repair record", status: "Available", remarks: "Repair log available" },
        { record: "Water quality report", status: "Not Available", remarks: "Latest report missing" },
      ],
      serviceDelivery: "Satisfactory",
      omCompliance: "Partial",
      recommendation: "Acceptable with Observations",
      majorObservations: "Plant is functional but leakage and missing water quality report need follow-up.",
      inspectorSignature: "Ahmed Khan",
      siteRepresentativeSignature: "ABC Contractor Rep",
    },
    tpv02: {
      plantId: "SITE-001",
      districtPhase: "Swat / Phase I",
      runningBillNo: "2nd",
      ipcMbReference: "IPC-02/MB-119",
      billHeadNo: "BH-01",
      boqType: "BOQ",
      plantLocation: "Mingora Main Road Water Filtration Plant",
      items: [
        {
          billItemNo: "1.01",
          description: "Filter housing installation",
          unit: "No",
          agreementBoqQty: "1",
          previousBilledQty: "0",
          uptoDateQty: "1",
          qtyVerifiedAtSite: "1",
          basis: "Count",
          qualityStatus: "OK",
          variance: "0",
          remarks: "Verified at site",
        },
        {
          billItemNo: "1.02",
          description: "PVC pipe connection",
          unit: "m",
          agreementBoqQty: "35",
          previousBilledQty: "20",
          uptoDateQty: "35",
          qtyVerifiedAtSite: "32",
          basis: "Measure",
          qualityStatus: "RPV",
          variance: "-3",
          remarks: "Measurement difference noted",
        },
      ],
    },
    tpv02a: {
      plantId: "SITE-001",
      districtPhase: "Swat / Phase I",
      billHeadSubhead: "Civil Works / Plant Room",
      runningBillIpcRef: "IPC-02",
      workCategory: "Plant Room",
      workCategoryOther: "",
      measuredBy: "Ahmed Khan",
      crossCheckedBy: "Contractor Site Engineer",
      measurements: [
        {
          itemNo: "CW-01",
          description: "Plant room floor",
          location: "Main room",
          nos: "1",
          length: "12",
          widthBreadth: "10",
          heightDepth: "",
          calculatedQty: "120",
          unit: "sft",
          qtyInBoq: "120",
          variance: "0",
          qualityCheck: "OK",
          remarks: "Matched BOQ",
        },
        {
          itemNo: "CW-02",
          description: "Drain channel",
          location: "Back side",
          nos: "1",
          length: "18",
          widthBreadth: "1.5",
          heightDepth: "1",
          calculatedQty: "27",
          unit: "cft",
          qtyInBoq: "30",
          variance: "-3",
          qualityCheck: "Needs Improvement",
          remarks: "Depth variation observed",
        },
      ],
      qualityChecks: [
        { parameter: "Excavation / foundation dimensions match", status: "OK", remarks: "Acceptable" },
        { parameter: "Plaster / paint finish acceptable", status: "Not OK", remarks: "Touch-up required" },
        { parameter: "No visible cracks / seepage / unsafe defects", status: "OK", remarks: "No major issue" },
      ],
      finalMeasuredBy: "Ahmed Khan",
      finalCheckedBy: "Contractor Site Engineer",
      date: "2026-06-20",
    },
  },
  {
    id: "TPV-002",
    target_id: "TPV-TGT-002",
    site_no: "SITE-002",
    inspector_name: "INS-002 - Bilal Hussain",
    contractor_name: "XYZ Engineering Services",
    contractor_code: "CON-002",
    contractor_approval: "Approved",
    final_approval: "Approved",
    is_contractor_approved: true,
    is_admin_approved: true,
    is_approved: true,
    created_at: "2026-06-24T09:15:00",
    updated_at: "2026-06-24T14:10:00",
    tpv01: {
      district: "Mardan",
      dateOfVisit: "2026-06-24",
      tehsil: "Takht Bhai",
      inspection_site: "SITE-002",
      plantLocation: "Takht Bhai Community Water Plant",
      phase: "Phase II",
      inspectorName: "INS-002 - Bilal Hussain",
      contractorRepPresent: "Yes",
      operatorCaretakerPresent: "No",
      gpsAppEntry: "Done",
      plant_type: "UF Plant",
      plantTypeOther: "",
      capacity: "2000 LPH",
      operatingAtVisit: "Yes",
      waterAvailableToPublic: "Yes",
      overall_status: "Functional",
      physicalChecks: [
        { item: "Major process equipment present", status: "OK", remarks: "All equipment installed" },
        { item: "Water point / taps usable", status: "OK", remarks: "Usable" },
        { item: "Drainage / wastewater disposal acceptable", status: "OK", remarks: "Drainage clear" },
      ],
      recordChecks: [
        { record: "O&M log", status: "Available", remarks: "Complete" },
        { record: "Complaint register", status: "Available", remarks: "No major complaint" },
        { record: "Plant handover / rehabilitation record", status: "Available", remarks: "Verified" },
      ],
      serviceDelivery: "Satisfactory",
      omCompliance: "Compliant",
      recommendation: "Acceptable",
      majorObservations: "Plant condition is satisfactory and records are available.",
      inspectorSignature: "Bilal Hussain",
      siteRepresentativeSignature: "XYZ Contractor Rep",
    },
    tpv02: {
      plantId: "SITE-002",
      districtPhase: "Mardan / Phase II",
      runningBillNo: "3rd",
      ipcMbReference: "IPC-03/MB-210",
      billHeadNo: "BH-04",
      boqType: "BOQ",
      plantLocation: "Takht Bhai Community Water Plant",
      items: [
        {
          billItemNo: "2.01",
          description: "Electrical wiring and DB installation",
          unit: "Job",
          agreementBoqQty: "1",
          previousBilledQty: "1",
          uptoDateQty: "1",
          qtyVerifiedAtSite: "1",
          basis: "Record",
          qualityStatus: "OK",
          variance: "0",
          remarks: "Record and site verified",
        },
        {
          billItemNo: "2.02",
          description: "Water storage tank",
          unit: "No",
          agreementBoqQty: "2",
          previousBilledQty: "1",
          uptoDateQty: "2",
          qtyVerifiedAtSite: "2",
          basis: "Count",
          qualityStatus: "OK",
          variance: "0",
          remarks: "Both tanks installed",
        },
      ],
    },
    tpv02a: {
      plantId: "SITE-002",
      districtPhase: "Mardan / Phase II",
      billHeadSubhead: "Pre-Fab Room Works",
      runningBillIpcRef: "IPC-03",
      workCategory: "Pre-Fab Room",
      workCategoryOther: "",
      measuredBy: "Bilal Hussain",
      crossCheckedBy: "XYZ Site Engineer",
      measurements: [
        {
          itemNo: "PF-01",
          description: "Pre-fab room panel fixing",
          location: "Plant room",
          nos: "1",
          length: "14",
          widthBreadth: "11",
          heightDepth: "9",
          calculatedQty: "154",
          unit: "sft",
          qtyInBoq: "154",
          variance: "0",
          qualityCheck: "OK",
          remarks: "Properly fixed",
        },
      ],
      qualityChecks: [
        { parameter: "Roof / sandwich panels / sheets properly fixed", status: "OK", remarks: "Good condition" },
        { parameter: "Electrical fixtures / wiring / DB / lights installed", status: "OK", remarks: "Installed" },
        { parameter: "Doors / windows / ventilators / locks installed", status: "OK", remarks: "All installed" },
      ],
      finalMeasuredBy: "Bilal Hussain",
      finalCheckedBy: "XYZ Site Engineer",
      date: "2026-06-24",
    },
  },
];

function getNested(record, keys, fallback = {}) {
  for (const key of keys) {
    if (record?.[key] && typeof record[key] === "object") {
      return record[key];
    }
  }

  return fallback;
}

function getTPV01(record) {
  return getNested(record, ["tpv01", "tpv_01", "tpv01_data", "tpv_01_data", "form01", "form_01"]);
}

function getTPV02(record) {
  return getNested(record, ["tpv02", "tpv_02", "tpv02_data", "tpv_02_data", "form02", "form_02"]);
}

function getTPV02A(record) {
  return getNested(record, ["tpv02a", "tpv_02a", "tpv02a_data", "tpv_02a_data", "form02a", "form_02a"]);
}

function getFirstValue(object, keys, fallback = "—") {
  for (const key of keys) {
    if (object?.[key] !== null && object?.[key] !== undefined && object?.[key] !== "") {
      return object[key];
    }
  }

  return fallback;
}

function statusText(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return valueOrDash(value);
}

function tableRows(rows, columns) {
  if (!Array.isArray(rows) || rows.length === 0) return [];

  return rows.map((row) =>
    columns.map((column) =>
      typeof column.value === "function" ? column.value(row) : row?.[column.key],
    ),
  );
}

function TPVSignatureFooter({ inspectorName, contractorName }) {
  return (
    <div className="edu-report-footer">
      <div className="edu-signature-box">
        <p className="edu-signature-label">Inspector Signature</p>
        <div className="edu-signature-line" />
        <p className="edu-signature-name">{valueOrDash(inspectorName)}</p>
      </div>

      <div className="edu-signature-box">
        <p className="edu-signature-label">Contractor / Site Representative</p>
        <div className="edu-signature-line" />
        <p className="edu-signature-name">{valueOrDash(contractorName)}</p>
      </div>

      <div className="edu-signature-box">
        <p className="edu-signature-label">Official Remarks</p>
        <div className="edu-signature-line" />
        <p className="edu-signature-name">For office use</p>
      </div>
    </div>
  );
}

function TPVApprovalSection({ record, sectionNumber = 10 }) {
  const approvalRows = [
    ["Inspector", valueOrDash(record.inspector_name)],
    ["Contractor", `${valueOrDash(record.contractor_code)} - ${valueOrDash(record.contractor_name)}`],
    ["Contractor Approval", record.is_contractor_approved ? "Approved" : "Pending"],
    ["Final Approval", record.is_approved ? "Approved" : "Not Approved"],
    ["Rejection Reason", record.rejection_reason],
    ["Last Updated", formatDateTime(record.updated_at)],
  ];

  return (
    <Section
      title={`${sectionNumber}. Verification and Approval`}
      note={`Generated on ${formatDateTime(new Date().toISOString())}`}
    >
      <DataTable columns={["Item", "Status / Detail"]} rows={approvalRows} />
    </Section>
  );
}

function TPVProformaReportPage({ record, index, printId }) {
  const tpv01 = getTPV01(record);
  const tpv02 = getTPV02(record);
  const tpv02a = getTPV02A(record);

  const inspectorName =
    getFirstValue(tpv01, ["inspectorName", "inspector_name"], "") ||
    getFirstValue(record, ["inspector_name", "inspectorName"], "");

  const contractorName = getFirstValue(
    record,
    ["contractor_name", "contractorName", "contractor"],
    "",
  );

  const siteNo =
    getFirstValue(tpv01, ["inspection_site", "plantId", "plant_id"], "") ||
    getFirstValue(tpv02, ["plantId", "plant_id"], "") ||
    getFirstValue(tpv02a, ["plantId", "plant_id"], "") ||
    getFirstValue(record, ["site_no", "siteNo", "plant_id", "inspection_site"], "");

  const physicalCheckRows = tableRows(tpv01.physicalChecks, [
    { key: "item" },
    { key: "status" },
    { key: "remarks" },
  ]);

  const recordCheckRows = tableRows(tpv01.recordChecks, [
    { key: "record" },
    { key: "status" },
    { key: "remarks" },
  ]);

  const boqRows = tableRows(tpv02.items, [
    { key: "billItemNo" },
    { key: "description" },
    { key: "unit" },
    { key: "agreementBoqQty" },
    { key: "previousBilledQty" },
    { key: "uptoDateQty" },
    { key: "qtyVerifiedAtSite" },
    { key: "basis" },
    { key: "qualityStatus" },
    { key: "variance" },
    { key: "remarks" },
  ]);

  const measurementRows = tableRows(tpv02a.measurements, [
    { key: "itemNo" },
    { key: "description" },
    { key: "location" },
    { key: "nos" },
    { key: "length" },
    { key: "widthBreadth" },
    { key: "heightDepth" },
    { key: "calculatedQty" },
    { key: "unit" },
    { key: "qtyInBoq" },
    { key: "variance" },
    { key: "qualityCheck" },
    { key: "remarks" },
  ]);

  const qualityCheckRows = tableRows(tpv02a.qualityChecks, [
    { key: "parameter" },
    { key: "status" },
    { key: "remarks" },
  ]);

  return (
    <ReportPageFrame
      printId={printId}
      reportTitle="Third Party Validation Proforma Report"
      reportIdPrefix="TPV"
      recordId={record.id || record.target_id || siteNo}
      recordNo={index + 1}
      description="Third Party Validation proforma containing TPV-01 plant visit and functionality details, TPV-02 IPC / BOQ verification, and TPV-02A measurement sheet details."
      metaItems={[
        { label: "Site / Plant No", value: siteNo },
        { label: "Inspector", value: inspectorName },
        { label: "Contractor", value: contractorName },
        { label: "District", value: getFirstValue(tpv01, ["district"], "") },
        { label: "Tehsil", value: getFirstValue(tpv01, ["tehsil"], "") },
        { label: "Date of Visit", value: formatDate(tpv01.dateOfVisit) },
        { label: "Plant Location", value: tpv01.plantLocation || tpv02.plantLocation },
        {
          label: "Final Status",
          value: record.is_approved ? "Approved" : "Not Approved",
        },
      ]}
      metrics={[
        {
          label: "Operating",
          value: statusText(tpv01.operatingAtVisit),
          help: "At time of visit",
        },
        {
          label: "Water Available",
          value: statusText(tpv01.waterAvailableToPublic),
          help: "Available to public",
        },
        {
          label: "Service Delivery",
          value: valueOrDash(tpv01.serviceDelivery),
          help: "TPV-01 assessment",
        },
        {
          label: "O&M Compliance",
          value: valueOrDash(tpv01.omCompliance),
          help: "Operation and maintenance",
        },
      ]}
    >
      <Section title="1. TPV-01 Basic Information" note="Plant visit and field verification">
        <FieldGrid
          rows={[
            { label: "District", value: tpv01.district },
            { label: "Date of Visit", value: formatDate(tpv01.dateOfVisit) },
            { label: "Tehsil / UC", value: tpv01.tehsil },
            { label: "Plant ID / Code", value: tpv01.inspection_site },
            { label: "Plant Location", value: tpv01.plantLocation },
            { label: "Phase", value: tpv01.phase },
            { label: "Inspector Name", value: tpv01.inspectorName },
            { label: "Contractor Rep Present", value: tpv01.contractorRepPresent },
            { label: "Operator / Caretaker Present", value: tpv01.operatorCaretakerPresent },
            { label: "GPS / App Entry", value: tpv01.gpsAppEntry },
          ]}
        />
      </Section>

      <Section title="2. TPV-01 Plant Status" note="Operational and service status">
        <FieldGrid
          rows={[
            { label: "Plant Type", value: tpv01.plant_type },
            { label: "Other Plant Type", value: tpv01.plantTypeOther },
            { label: "Capacity", value: tpv01.capacity },
            { label: "Operating at Visit", value: tpv01.operatingAtVisit },
            { label: "Water Available to Public", value: tpv01.waterAvailableToPublic },
            { label: "Overall Status", value: tpv01.overall_status },
          ]}
        />
      </Section>

      <Section title="3. TPV-01 Physical / Quality Check" note="Quick physical verification">
        <DataTable columns={["Item", "Status", "Remarks"]} rows={physicalCheckRows} />
      </Section>

      <Section title="4. TPV-01 Record Check" note="Record availability and remarks">
        <DataTable columns={["Record", "Status", "Remarks"]} rows={recordCheckRows} />
      </Section>

      <Section title="5. TPV-01 Overall Assessment" note="Service delivery and recommendation">
        <FieldGrid
          rows={[
            { label: "Service Delivery", value: tpv01.serviceDelivery },
            { label: "O&M Compliance", value: tpv01.omCompliance },
            { label: "Recommendation", value: tpv01.recommendation },
            { label: "Major Observations", value: tpv01.majorObservations },
            { label: "Inspector Signature", value: tpv01.inspectorSignature },
            {
              label: "Site Representative Signature",
              value: tpv01.siteRepresentativeSignature,
            },
          ]}
        />
      </Section>

      <Section title="6. TPV-02 Header Information" note="IPC / BOQ item verification">
        <FieldGrid
          rows={[
            { label: "Plant ID / Code", value: tpv02.plantId },
            { label: "District / Phase", value: tpv02.districtPhase },
            { label: "Running Bill No.", value: tpv02.runningBillNo },
            { label: "IPC / MB Reference", value: tpv02.ipcMbReference },
            { label: "Bill Head No.", value: tpv02.billHeadNo },
            { label: "BOQ / Non-BOQ / VO", value: tpv02.boqType },
            { label: "Plant Location", value: tpv02.plantLocation },
          ]}
        />
      </Section>

      <Section title="7. TPV-02 Item-wise Verification" note="BOQ / IPC quantity and quality status">
        <DataTable
          columns={[
            "Bill / Item No.",
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
          ]}
          rows={boqRows}
        />
      </Section>

      <Section title="8. TPV-02A Header and Measurements" note="Civil / pre-fab / plant room measurements">
        <FieldGrid
          rows={[
            { label: "Plant ID / Code", value: tpv02a.plantId },
            { label: "District / Phase", value: tpv02a.districtPhase },
            { label: "Bill Head / Subhead", value: tpv02a.billHeadSubhead },
            { label: "Running Bill / IPC Ref.", value: tpv02a.runningBillIpcRef },
            { label: "Work Category", value: tpv02a.workCategory },
            { label: "Other Work Category", value: tpv02a.workCategoryOther },
            { label: "Measured By", value: tpv02a.measuredBy },
            { label: "Cross-checked By", value: tpv02a.crossCheckedBy },
          ]}
        />

        <DataTable
          columns={[
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
          ]}
          rows={measurementRows}
        />
      </Section>

      <Section title="9. TPV-02A Quality Check" note="Civil / room / pre-fab quality checks">
        <DataTable
          columns={["Quality Parameter", "Status", "Remarks"]}
          rows={qualityCheckRows}
        />

        <FieldGrid
          rows={[
            { label: "Final Measured By", value: tpv02a.finalMeasuredBy },
            { label: "Final Checked By", value: tpv02a.finalCheckedBy },
            { label: "Date", value: formatDate(tpv02a.date) },
          ]}
        />
      </Section>

      <TPVApprovalSection record={record} sectionNumber={10} />

      <TPVSignatureFooter
        inspectorName={inspectorName || tpv01.inspectorSignature}
        contractorName={contractorName || tpv01.siteRepresentativeSignature}
      />
    </ReportPageFrame>
  );
}

export default function ShowTPVProforma() {
  const { isLight } = useTheme();
  const { setState } = useNavbar();
  const navigate = useNavigate();
  const location = useLocation();
  const { targetId } = useParams();

  const [search, setSearch] = useState("");
  const [expandedMap, setExpandedMap] = useState({});

  useEffect(() => {
    setState({
      title: "TPV Proforma",
      subtitle: "Contractor TPV-01, TPV-02 and TPV-02A verification records",
    });

    return () => setState({ title: "", subtitle: "", actions: null });
  }, [setState]);

  const records = useMemo(() => {
    if (!targetId) return DUMMY_TPV_RECORDS;

    const matched = DUMMY_TPV_RECORDS.filter(
      (record) => String(record.target_id) === String(targetId) || String(record.id) === String(targetId),
    );

    return matched.length ? matched : DUMMY_TPV_RECORDS;
  }, [targetId]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return records;

    return records.filter((record) => {
      const tpv01 = getTPV01(record);
      const siteNo =
        getFirstValue(tpv01, ["inspection_site", "plantId"], "") ||
        getFirstValue(record, ["site_no", "siteNo"], "");

      return [
        record.id,
        record.target_id,
        record.inspector_name,
        record.contractor_name,
        siteNo,
        tpv01.district,
        tpv01.tehsil,
        tpv01.overall_status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [records, search]);

  const pageClasses = isLight
    ? "relative min-h-screen bg-[#f5f5f5] text-gray-950"
    : "relative min-h-screen bg-black text-gray-100";

  const surface = isLight
    ? "border-gray-200 bg-white"
    : "border-white/10 bg-[#111111]";

  const tableCell = isLight ? "text-gray-900" : "text-gray-200";
  const tableMuted = isLight ? "text-gray-500" : "text-gray-500";

  const searchInput = isLight
    ? "h-9 rounded-xl border border-gray-200 bg-white pl-8 pr-3 text-[12px] text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-900"
    : "h-9 rounded-xl border border-white/10 bg-[#0b0b0b] pl-8 pr-3 text-[12px] text-white outline-none transition placeholder:text-gray-600 focus:border-white/40";

  const approvedCount = filteredRecords.filter((record) => record.is_approved).length;
  const pendingCount = filteredRecords.length - approvedCount;

  const handlePrintSingle = (event, printId) => {
    event.stopPropagation();

    const printContent = document.getElementById(printId);
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=1100,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>TPV Proforma</title>
          <style>${reportStyles}</style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleToggle = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={pageClasses}>
      <style>{`${reportStyles}\n${contractorApprovalStyles}`}</style>

      <main className="relative w-full max-w-none space-y-5 px-4 py-4">
        <section className={cn("rounded-2xl border shadow-sm", surface)}>
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4",
              isLight ? "border-gray-200" : "border-white/10",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  isLight
                    ? "bg-blue-50 text-blue-600"
                    : "bg-blue-500/10 text-blue-400",
                )}
              >
                <ClipboardCheck className="h-4 w-4" />
              </div>

              <div>
                <div
                  className={cn(
                    "text-[14px] font-semibold",
                    isLight ? "text-gray-950" : "text-white",
                  )}
                >
                  TPV Proforma Records
                </div>
                <div className={cn("text-[11px]", tableMuted)}>
                  Target ID: {valueOrDash(targetId || location.state?.targetId)} | {filteredRecords.length} record
                  {filteredRecords.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search proformas..."
                  className={cn(searchInput, "w-56")}
                />
              </div>

              <button
                type="button"
                onClick={() => setSearch("")}
                className={cn(
                  "rounded-xl border px-4 py-2 text-[12px] font-semibold transition",
                  isLight
                    ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    : "border-white/10 bg-[#0b0b0b] text-gray-300 hover:bg-white/5",
                )}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div className={cn("rounded-xl border p-4", isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0b0b0b]")}>
              <p className={cn("text-[11px]", tableMuted)}>Total Records</p>
              <p className={cn("mt-1 text-[22px] font-semibold", tableCell)}>{filteredRecords.length}</p>
            </div>
            <div className={cn("rounded-xl border p-4", isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0b0b0b]")}>
              <p className={cn("text-[11px]", tableMuted)}>Final Approved</p>
              <p className={cn("mt-1 text-[22px] font-semibold", tableCell)}>{approvedCount}</p>
            </div>
            <div className={cn("rounded-xl border p-4", isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0b0b0b]")}>
              <p className={cn("text-[11px]", tableMuted)}>Pending</p>
              <p className={cn("mt-1 text-[22px] font-semibold", tableCell)}>{pendingCount}</p>
            </div>
          </div>
        </section>

        <section className={cn("rounded-2xl border shadow-sm", surface)}>
          <div
            className={cn(
              "border-b px-5 py-4",
              isLight ? "border-gray-200" : "border-white/10",
            )}
          >
            <h3 className={cn("text-[14px] font-semibold", tableCell)}>
              TPV Proforma List
            </h3>
            <p className={cn("mt-1 text-[11px]", tableMuted)}>
              Click any record to expand the complete TPV proforma report.
            </p>
          </div>

          <div className="space-y-3 p-5">
            {filteredRecords.length === 0 ? (
              <div className={cn("rounded-xl border px-5 py-12 text-center text-[13px]", isLight ? "border-gray-200 text-gray-500" : "border-white/10 text-gray-500")}>
                No TPV proforma records found.
              </div>
            ) : (
              filteredRecords.map((record, index) => {
                const id = record.id || record.target_id || index;
                const tpv01 = getTPV01(record);
                const isExpanded = Boolean(expandedMap[id]);
                const printId = `tpv-print-${String(id).replace(/[^a-zA-Z0-9_-]/g, "-")}`;

                return (
                  <article
                    key={id}
                    className={cn(
                      "overflow-hidden rounded-2xl border",
                      isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#111111]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(id)}
                      className={cn(
                        "flex w-full flex-wrap items-center justify-between gap-4 px-5 py-4 text-left transition",
                        isLight ? "hover:bg-gray-50" : "hover:bg-white/5",
                      )}
                    >
                      <div>
                        <h4 className={cn("text-[14px] font-semibold", tableCell)}>
                          {index + 1}. TPV Proforma - Site {valueOrDash(record.site_no || tpv01.inspection_site)}
                        </h4>
                        <p className={cn("mt-1 text-[12px]", tableMuted)}>
                          Inspector: {valueOrDash(record.inspector_name || tpv01.inspectorName)} | Contractor: {valueOrDash(record.contractor_name)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            record.is_approved
                              ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
                          )}
                        >
                          {record.is_approved ? "Final Approved" : "Pending"}
                        </span>

                        <span
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-[11px] font-semibold",
                            isLight
                              ? "border-gray-200 bg-white text-gray-700"
                              : "border-white/10 bg-[#0b0b0b] text-gray-300",
                          )}
                        >
                          {isExpanded ? "Hide" : "View"}
                        </span>

                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(event) => handlePrintSingle(event, printId)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") handlePrintSingle(event, printId);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-blue-800"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Print
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-200">
                        <TPVProformaReportPage
                          record={record}
                          index={index}
                          printId={printId}
                        />
                      </div>
                    )}

                    <div className="edu-print-store">
                      <TPVProformaReportPage
                        record={record}
                        index={index}
                        printId={`${printId}-store`}
                      />
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
