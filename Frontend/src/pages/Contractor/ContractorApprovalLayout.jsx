import React from "react";

export const reportStyles = `
  .edu-report-wrapper {
    width: 100%;
  }

  .edu-report-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 14px;
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
  }

  .edu-report-toolbar-title {
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    color: #111827;
  }

  .edu-report-toolbar-subtitle {
    margin: 3px 0 0;
    font-size: 12px;
    color: #6b7280;
  }

  .edu-report-button {
    border: 1px solid #111827;
    border-radius: 8px;
    padding: 8px 12px;
    background: #111827;
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }

  .edu-report-button:hover {
    background: #1f2937;
  }

  .edu-report-button-secondary {
    background: #ffffff;
    color: #111827;
    border-color: #d1d5db;
  }

  .edu-report-button-secondary:hover {
    background: #f9fafb;
  }

  .edu-report-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .edu-record-card {
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    background: #ffffff;
  }

  .edu-record-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 16px;
    background: #fafafa;
    cursor: pointer;
  }

  .edu-record-title {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .edu-record-meta {
    margin: 4px 0 0;
    font-size: 12px;
    color: #6b7280;
  }

  .edu-record-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }

  .edu-approval-control {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 7px 10px;
    background: #ffffff;
    color: #374151;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
  }

  .edu-report-page {
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    color: #111827;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .edu-report-page-inner {
    padding: 22px;
  }

  .edu-letterhead {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid #d1d5db;
  }

  .edu-kicker {
    display: inline-block;
    margin-bottom: 8px;
    color: #4b5563;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .edu-letterhead h1 {
    margin: 0;
    color: #111827;
    font-size: 22px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .edu-letterhead p {
    margin: 7px 0 0;
    max-width: 760px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.5;
  }

  .edu-report-id-box {
    min-width: 150px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 9px 10px;
    background: #ffffff;
    text-align: right;
  }

  .edu-report-id-label {
    margin: 0;
    color: #6b7280;
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .edu-report-id-value {
    margin: 3px 0 0;
    color: #111827;
    font-size: 13px;
    font-weight: 500;
  }

  .edu-meta-panel {
    margin-top: 14px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .edu-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .edu-meta-item {
    padding: 10px 12px;
    border-right: 1px solid #e5e7eb;
    background: #ffffff;
  }

  .edu-meta-item:last-child {
    border-right: 0;
  }

  .edu-meta-label {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
  }

  .edu-meta-value {
    margin: 4px 0 0;
    color: #111827;
    font-size: 13px;
    font-weight: 400;
    word-break: break-word;
  }

  .edu-metric-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
  }

  .edu-metric-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
  }

  .edu-metric-label {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .edu-metric-value {
    margin: 7px 0 0;
    color: #111827;
    font-size: 22px;
    line-height: 1;
    font-weight: 500;
  }

  .edu-metric-help {
    margin: 7px 0 0;
    color: #6b7280;
    font-size: 11px;
  }

  .edu-section {
    margin-top: 16px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
  }

  .edu-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    border-bottom: 1px solid #e5e7eb;
    background: #fafafa;
  }

  .edu-section-title {
    margin: 0;
    color: #111827;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .edu-section-note {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
    text-align: right;
  }

  .edu-field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .edu-field-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .edu-field {
    display: grid;
    grid-template-columns: minmax(132px, 0.95fr) minmax(0, 1.25fr);
    gap: 10px;
    min-height: 40px;
    padding: 10px 12px;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  .edu-field-grid:not(.edu-field-grid-three) .edu-field:nth-child(2n),
  .edu-field-grid-three .edu-field:nth-child(3n) {
    border-right: 0;
  }

  .edu-field-label {
    color: #6b7280;
    font-size: 12px;
    font-weight: 400;
  }

  .edu-field-value {
    color: #111827;
    font-size: 12px;
    font-weight: 400;
    word-break: break-word;
  }

  .edu-table-wrap {
    overflow-x: auto;
  }

  .edu-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .edu-table th {
    padding: 9px 11px;
    border-bottom: 1px solid #e5e7eb;
    background: #fafafa;
    color: #374151;
    text-align: left;
    font-weight: 500;
  }

  .edu-table td {
    padding: 9px 11px;
    border-bottom: 1px solid #e5e7eb;
    color: #111827;
    font-weight: 400;
    vertical-align: top;
  }

  .edu-table tr:last-child td {
    border-bottom: 0;
  }

  .edu-pill {
    display: inline-flex;
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 999px;
    padding: 3px 8px;
    background: #ffffff;
    color: #374151;
    font-size: 11px;
    font-weight: 400;
  }

  .edu-report-footer {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .edu-signature-box {
    min-height: 70px;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 11px;
    background: #ffffff;
  }

  .edu-signature-label {
    margin: 0;
    color: #4b5563;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .edu-signature-line {
    margin-top: 25px;
    border-top: 1px solid #9ca3af;
  }

  .edu-signature-name {
    margin: 7px 0 0;
    color: #111827;
    font-size: 12px;
    font-weight: 400;
  }

  .edu-print-store {
    display: none;
  }

  @media screen and (max-width: 768px) {
    .edu-report-toolbar,
    .edu-record-card-header,
    .edu-letterhead {
      grid-template-columns: 1fr;
      flex-direction: column;
      align-items: stretch;
    }

    .edu-record-actions {
      justify-content: flex-start;
    }

    .edu-report-id-box {
      text-align: left;
    }

    .edu-meta-grid,
    .edu-metric-grid,
    .edu-report-footer,
    .edu-field-grid,
    .edu-field-grid-three {
      grid-template-columns: 1fr;
    }

    .edu-meta-item,
    .edu-field,
    .edu-field-grid:not(.edu-field-grid-three) .edu-field:nth-child(2n),
    .edu-field-grid-three .edu-field:nth-child(3n) {
      border-right: 0;
    }

    .edu-field {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 8mm;
    }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #111827 !important;
      font-family: Inter, Arial, sans-serif !important;
    }

    .screen-only,
    .edu-report-toolbar,
    .edu-record-card-header {
      display: none !important;
    }

    .edu-print-store,
    .edu-print-document {
      display: block !important;
      width: 100% !important;
    }

    .edu-report-wrapper,
    .edu-report-list,
    .edu-record-card {
      display: block !important;
      width: 100% !important;
      border: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
    }

    .edu-report-page {
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: #ffffff !important;
      box-shadow: none !important;
      page-break-after: always;
      break-after: page;
    }

    .edu-report-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }

    .edu-report-page-inner {
      padding: 22px !important;
    }

    .edu-letterhead {
      display: grid !important;
      grid-template-columns: 1fr auto !important;
      align-items: start !important;
      gap: 18px !important;
    }

    .edu-report-id-box {
      min-width: 150px !important;
      text-align: right !important;
    }

    .edu-meta-grid,
    .edu-metric-grid {
      display: grid !important;
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }

    .edu-report-footer {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .edu-field-grid {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .edu-field-grid-three {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }

    .edu-field {
      display: grid !important;
      grid-template-columns: minmax(132px, 0.95fr) minmax(0, 1.25fr) !important;
      gap: 10px !important;
    }

    .edu-meta-item,
    .edu-field {
      border-right: 1px solid #e5e7eb !important;
    }

    .edu-meta-item:last-child,
    .edu-field-grid:not(.edu-field-grid-three) .edu-field:nth-child(2n),
    .edu-field-grid-three .edu-field:nth-child(3n) {
      border-right: 0 !important;
    }

    .edu-section,
    .edu-metric-card,
    .edu-meta-panel,
    .edu-signature-box {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

export const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === "";

export const valueOrDash = (value) => {
  if (React.isValidElement(value)) return value;
  if (isEmpty(value)) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return value;
};

export const numberValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const sumValues = (...values) =>
  values.reduce((total, value) => total + numberValue(value), 0);

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const titleCase = (value) => {
  if (isEmpty(value)) return "—";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const withOther = (value, otherValue) => {
  if (isEmpty(value) && isEmpty(otherValue)) return "—";
  if (
    !isEmpty(value) &&
    String(value).toLowerCase().includes("other") &&
    !isEmpty(otherValue)
  ) {
    return `${value} - ${otherValue}`;
  }
  return valueOrDash(value || otherValue);
};

export const yesNoFromFields = (yesValue, noValue) => {
  if (yesValue === true || yesValue === "true" || yesValue === "yes" || yesValue === "Yes") return "Yes";
  if (noValue === true || noValue === "true" || noValue === "no" || noValue === "No") return "No";
  return "—";
};

const safeDomId = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, "-");

export function StatusPill({ active, trueText = "Yes", falseText = "No" }) {
  return <span className="edu-pill">{active ? trueText : falseText}</span>;
}

export function MetricCard({ label, value, help }) {
  return (
    <div className="edu-metric-card">
      <p className="edu-metric-label">{label}</p>
      <p className="edu-metric-value">{valueOrDash(value)}</p>
      {help && <p className="edu-metric-help">{help}</p>}
    </div>
  );
}

export function Section({ title, note, children }) {
  return (
    <section className="edu-section">
      <div className="edu-section-header">
        <h3 className="edu-section-title">{title}</h3>
        {note && <p className="edu-section-note">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export function FieldGrid({ rows = [], columns = 2 }) {
  return (
    <div
      className={`edu-field-grid ${columns === 3 ? "edu-field-grid-three" : ""}`}
    >
      {rows.map((row, idx) => (
        <div className="edu-field" key={`${row.label}-${idx}`}>
          <div className="edu-field-label">{row.label}</div>
          <div className="edu-field-value">{valueOrDash(row.value)}</div>
        </div>
      ))}
    </div>
  );
}

export function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="edu-table-wrap">
      <table className="edu-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={`${col}-${idx}`}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cellIdx) => (
                <td key={`${idx}-${cellIdx}`}>{valueOrDash(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SignatureFooter({ surveyorName, contractorName }) {
  return (
    <div className="edu-report-footer">
      <div className="edu-signature-box">
        <p className="edu-signature-label">Surveyor Signature</p>
        <div className="edu-signature-line" />
        <p className="edu-signature-name">{valueOrDash(surveyorName)}</p>
      </div>
      <div className="edu-signature-box">
        <p className="edu-signature-label">Contractor Verification</p>
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

export function ApprovalSection({ record, sectionNumber = 7 }) {
  const approvalRows = [
    ["Surveyor", `${valueOrDash(record.surveyor_code)} - ${valueOrDash(record.surveyor_name)}`],
    ["Contractor", `${valueOrDash(record.contractor_code)} - ${valueOrDash(record.contractor_name)}`],
    [
      "Contractor Approval",
      <StatusPill
        active={record.is_contractor_approved}
        trueText="Approved"
        falseText="Pending"
      />,
    ],
    [
      "Super Admin Approval",
      <StatusPill
        active={record.is_superadmin_approved}
        trueText="Approved"
        falseText="Pending"
      />,
    ],
    [
      "Final Approval",
      <StatusPill
        active={record.is_approved}
        trueText="Approved"
        falseText="Not Approved"
      />,
    ],
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

export function ReportPageFrame({
  printId,
  reportTitle,
  reportIdPrefix,
  recordId,
  recordNo,
  description,
  metaItems = [],
  metrics = [],
  children,
}) {
  return (
    <article className="edu-report-page" id={printId}>
      <div className="edu-report-page-inner">
        <div className="edu-letterhead">
          <div>
            <span className="edu-kicker">Household Survey Only</span>
            <h1>{reportTitle}</h1>
            <p>{description}</p>
          </div>

          <div className="edu-report-id-box">
            <p className="edu-report-id-label">Report ID</p>
            <p className="edu-report-id-value">
              {reportIdPrefix}-{valueOrDash(recordId)}
            </p>
            <p className="edu-report-id-label" style={{ marginTop: 8 }}>
              Record No.
            </p>
            <p className="edu-report-id-value">#{recordNo}</p>
          </div>
        </div>

        {metaItems.length > 0 && (
          <div className="edu-meta-panel">
            <div className="edu-meta-grid">
              {metaItems.map((item, idx) => (
                <div className="edu-meta-item" key={`${item.label}-${idx}`}>
                  <p className="edu-meta-label">{item.label}</p>
                  <p className="edu-meta-value">{valueOrDash(item.value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {metrics.length > 0 && (
          <div className="edu-metric-grid">
            {metrics.map((metric, idx) => (
              <MetricCard key={`${metric.label}-${idx}`} {...metric} />
            ))}
          </div>
        )}

        {children}
      </div>
    </article>
  );
}


export const contractorApprovalStyles = `
  .contractor-approval-page {
    width: 100%;
    color: #111827;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .contractor-approval-heading {
    margin: 0;
    color: #111827;
    font-size: 22px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .contractor-approval-subtitle {
    margin: 5px 0 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 400;
  }

  .contractor-back-button {
    border: 1px solid #111827;
    border-radius: 8px;
    padding: 8px 12px;
    background: #111827;
    color: #ffffff;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }

  .contractor-back-button:hover {
    background: #1f2937;
  }

  .contractor-summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    margin: 14px 0 18px;
  }

  .contractor-summary-card {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    background: #ffffff;
  }

  .contractor-summary-card.approved {
    border-left: 4px solid #16a34a;
  }

  .contractor-summary-card.unchecked {
    border-left: 4px solid #dc2626;
  }

  .contractor-summary-card.total {
    border-left: 4px solid #4f46e5;
  }

  .contractor-summary-label {
    margin: 0;
    color: #6b7280;
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .contractor-summary-value {
    margin: 7px 0 0;
    color: #111827;
    font-size: 22px;
    line-height: 1;
    font-weight: 500;
  }

  .contractor-record-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .contractor-record-card {
    overflow: hidden;
    border: 1px solid #c5c6c8;
    border-radius: 14px;
    background: #ffffff;
  }

  .contractor-record-header {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr 1fr;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: #f3f3f3;
    cursor: pointer;
  }

  .contractor-record-title {
    margin: 0;
    color: #111827;
    font-size: 14px;
    line-height: 1.35;
    font-weight: 500;
  }

  .contractor-record-text {
    margin: 4px 0 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 400;
  }

  .contractor-record-text strong {
    color: #374151;
    font-weight: 500;
  }

  .contractor-record-date {
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
    text-align: center;
    font-weight: 400;
  }

  .contractor-record-date-label {
    margin: 0;
    color: #374151;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 500;
  }

  .contractor-record-date-value {
    margin: 3px 0 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 400;
  }

  .contractor-record-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
    text-align: right;
    font-weight: 400;
  }

  .contractor-button-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 2px;
  }

  .contractor-approve-button,
  .contractor-reject-button {
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 7px 10px;
    background: #ffffff;
    color: #374151;
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    white-space: nowrap;
  }

  .contractor-approve-button:hover,
  .contractor-approve-button.active {
    border-color: #0e7132;
    background: #1d562e;
    color: #ffffff;
  }

  .contractor-reject-button:hover,
  .contractor-reject-button.active {
    border-color: #dc2626;
    background: #cb2d2d;
    color: #ffffff;
  }

  .contractor-approve-button:disabled,
  .contractor-reject-button:disabled {
    opacity: 0.85;
    cursor: not-allowed;
  }

  .contractor-status-line {
    margin: 0;
    color: #6b7280;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 400;
  }

  .contractor-status-line strong {
    color: #374151;
    font-weight: 500;
  }

  .contractor-status-value {
    color: #111827;
    font-weight: 500;
  }

  .contractor-rejection-reason {
    margin: 0;
    color: #dc2626;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 400;
  }

  .contractor-expand-text {
    margin-top: 2px;
    color: #4f46e5;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 500;
  }

  .contractor-expanded-report {
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
  }

  .contractor-empty-state {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    padding: 36px 16px;
    color: #6b7280;
    text-align: center;
    font-size: 12px;
  }

  @media screen and (max-width: 900px) {
    .contractor-record-header {
      grid-template-columns: 1fr;
      align-items: start;
    }

    .contractor-record-date,
    .contractor-record-status {
      text-align: left;
      align-items: flex-start;
    }

    .contractor-button-row {
      justify-content: flex-start;
    }
  }

  @media screen and (max-width: 768px) {
    .contractor-summary-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export function ContractorApprovalContainer({
  title,
  targetId,
  formType,
  records = [],
  expandedMap = {},
  setExpandedMap,
  onBack,
  userRole,
  handleApproval,
  canContractorEdit,
  isSuperadminLocked,
  getRecordTitle,
  renderPage,
  reportKey = "survey",
  emptyText = "No survey records found.",
}) {
  const safeRecords = Array.isArray(records) ? records : [];
  const approvedCount = safeRecords.filter(
    (record) => record.is_contractor_approved || record.is_superadmin_approved,
  ).length;
  const uncheckedCount = safeRecords.length - approvedCount;

  const toggleRecordExpand = (id) => {
    if (!setExpandedMap) return;
    setExpandedMap((prev) => ({ ...prev, [id]: !prev?.[id] }));
  };

  const stopAndApprove = (event, id, approved) => {
    event.stopPropagation();
    if (typeof handleApproval === "function") {
      handleApproval(id, approved);
    }
  };

  return (
    <div className="p-6 contractor-approval-page">
      <style>{`${reportStyles}\n${contractorApprovalStyles}`}</style>

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="contractor-approval-heading">{title}</h2>
          <p className="contractor-approval-subtitle">
            Target ID: {targetId} | Form Type: {formType}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="contractor-back-button"
        >
          Back
        </button>
      </div>

      <div className="contractor-summary-grid">
        <div className="contractor-summary-card approved">
          <p className="contractor-summary-label">Checked / Approved</p>
          <p className="contractor-summary-value">{approvedCount}</p>
        </div>
        <div className="contractor-summary-card unchecked">
          <p className="contractor-summary-label">Unchecked</p>
          <p className="contractor-summary-value">{uncheckedCount}</p>
        </div>
        <div className="contractor-summary-card total">
          <p className="contractor-summary-label">Total Records</p>
          <p className="contractor-summary-value">{safeRecords.length}</p>
        </div>
      </div>

      {safeRecords.length === 0 ? (
        <div className="contractor-empty-state">{emptyText}</div>
      ) : (
        <div className="contractor-record-list">
          {safeRecords.map((record, index) => {
            const id = record.id ?? index;
            const isExpanded = Boolean(expandedMap?.[id]);
            const contractorLocked =
              typeof canContractorEdit === "function" ? !canContractorEdit(record) : false;
            const superadminLocked =
              typeof isSuperadminLocked === "function" ? isSuperadminLocked(record) : false;

            return (
              <div key={id} className="contractor-record-card">
                <div
                  className="contractor-record-header"
                  onClick={() => toggleRecordExpand(id)}
                >
                  <div>
                    <h3 className="contractor-record-title">
                      {index + 1}. {valueOrDash(getRecordTitle?.(record) || `Record ${index + 1}`)}
                    </h3>
                    <p className="contractor-record-text">
                      <strong>Surveyor:</strong> {valueOrDash(record.surveyor_code)} - {valueOrDash(record.surveyor_name)}
                    </p>
                    <p className="contractor-record-text">
                      <strong>Contractor:</strong> {valueOrDash(record.contractor_code)} - {valueOrDash(record.contractor_name)}
                    </p>
                  </div>

                  <div className="contractor-record-date">
                    <p className="contractor-record-date-label">Survey Date &amp; Time</p>
                    <p className="contractor-record-date-value">
                      {formatDateTime(record.created_at)}
                    </p>
                  </div>

                  <div className="contractor-record-status">
                    <div
                      className="contractor-button-row"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {userRole === "contractor" && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => stopAndApprove(event, id, true)}
                            disabled={contractorLocked}
                            className={`contractor-approve-button ${record.is_contractor_approved ? "active" : ""}`}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={(event) => stopAndApprove(event, id, false)}
                            disabled={contractorLocked}
                            className={`contractor-reject-button ${record.is_contractor_rejected ? "active" : ""}`}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {userRole === "superadmin" && (
                        <>
                          <button
                            type="button"
                            onClick={(event) => stopAndApprove(event, id, true)}
                            disabled={superadminLocked}
                            className={`contractor-approve-button ${record.is_superadmin_approved ? "active" : ""}`}
                          >
                            Final Approve
                          </button>
                          <button
                            type="button"
                            onClick={(event) => stopAndApprove(event, id, false)}
                            disabled={superadminLocked}
                            className={`contractor-reject-button ${record.is_superadmin_rejected ? "active" : ""}`}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>

                    <p className="contractor-status-line">
                      <strong>Contractor Approved:</strong>{" "}
                      <span className="contractor-status-value">
                        {record.is_contractor_approved ? "Yes" : "No"}
                      </span>
                    </p>
                    <p className="contractor-status-line">
                      <strong>Final Approved:</strong>{" "}
                      <span className="contractor-status-value">
                        {record.is_superadmin_approved ? "Yes" : "No"}
                      </span>
                    </p>
                    {record.rejection_reason && (
                      <p className="contractor-rejection-reason">
                        <strong>Reason:</strong> {record.rejection_reason}
                      </p>
                    )}
                    <div className="contractor-expand-text">
                      {isExpanded ? "▲ Collapse" : "▼ Expand"}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="contractor-expanded-report">
                    {renderPage?.(record, index, `${reportKey}-approval-${id}`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
