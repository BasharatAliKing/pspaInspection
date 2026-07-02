import React, { useState, useMemo, useEffect } from "react";

import {
  Eye,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  CheckCircle,
  Layers3,
} from "lucide-react";
import { useTheme } from "../../components/Layout";

const TableThirdParty = ({ isOpen, boqList = [], handleView }) => {
  const [multiplier, setMultiplier] = useState(10);
  const { isLight } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!search.trim()) return boqList;

    const keyword = search.toLowerCase();

    return boqList.filter(
      (item) =>
        item.description?.toLowerCase().includes(keyword) ||
        item.mrs_ref_no?.toLowerCase().includes(keyword) ||
        item.unit?.toLowerCase().includes(keyword) ||
        String(item.quantity).includes(keyword) ||
        item.forInspection?.status?.toLowerCase().includes(keyword),
    );
  }, [boqList, search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  const getStatusClasses = (status = "pending") => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
      case "failed":
        return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    }
  };

  const surfaceClass = isLight
    ? "border-slate-200 bg-white shadow-[0_10px_35px_rgba(17,26,61,0.08)]"
    : "border-slate-800 bg-slate-900/80 shadow-[0_10px_35px_rgba(0,0,0,0.28)]";

  const headerClass = isLight
    ? "border-slate-200 bg-[#111a3d] text-white"
    : "border-slate-800 bg-slate-800 text-slate-100";

  const rowClass = isLight
    ? "border-slate-100 hover:bg-slate-50"
    : "border-slate-800 hover:bg-slate-800/70";

  const textClass = isLight ? "text-slate-700" : "text-slate-300";
  const mutedClass = isLight ? "text-slate-500" : "text-slate-400";
  const subtleClass = isLight
    ? "bg-slate-50 text-slate-600"
    : "bg-slate-800 text-slate-300";
  const buttonClass = isLight
    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
    : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700";

  const totalQuantity = useMemo(() => {
    return filteredData.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0,
    );
  }, [filteredData]);

  console.log(totalQuantity);

  const totalClaimedQuantity = useMemo(() => {
    return filteredData.reduce(
      (sum, item) =>
        sum + (Number(item.forInspection?.inspected_claimed_quantity) || 0),
      0,
    );
  }, [filteredData]);

  const totalInspectedQuantity = useMemo(() => {
    return filteredData.reduce(
      (sum, item) =>
        sum + (Number(item.forInspection?.inspected_quantity) || 0),
      0,
    );
  }, [filteredData]);

  return (
    <>
      <div className={`overflow-hidden rounded-2xl border ${surfaceClass}`}>
        <div
          className={`flex flex-col gap-3 border-b px-5 py-4 md:flex-row md:items-center md:justify-between ${isLight ? "border-slate-200 bg-slate-50/80" : "border-slate-800 bg-slate-950/50"}`}
        >
          <div>
            <h2
              className={`text-base font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}
            >
              Inspection Queue
            </h2>
            <p className={`text-sm ${mutedClass}`}>
              Review BOQ items and their current inspection status
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${isLight ? "bg-[#111a3d]/10 text-[#111a3d]" : "bg-slate-800 text-slate-300"}`}
          >
            {boqList.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className={`flex flex-col gap-4 px-5 py-4 border-b ${
              isLight
                ? "border-slate-200 bg-white"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <div className="relative w-full md:w-96">
              <Search
                size={18}
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isLight ? "text-slate-400" : "text-slate-500"
                }`}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Description, MRS Ref No or Unit..."
                className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#111a3d] ${
                  isLight
                    ? "border-slate-300 bg-white text-slate-700 placeholder:text-slate-400"
                    : "border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                }`}
              />
            </div>
          </div>
          <table className="w-full min-w-[860px] text-sm">
            <thead className={headerClass}>
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Sr.
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  MRS/Ref No
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item, index) => {
                  const status = item.forInspection?.status || "pending";

                  return (
                    <tr
                      key={item.id}
                      className={`border-b transition-colors ${rowClass}`}
                    >
                      <td
                        className={`px-4 py-3 font-mono text-xs font-semibold ${mutedClass}`}
                      >
                        {startIndex + index + 1}
                      </td>

                      <td className={`max-w-[220px] px-4 py-3 ${textClass}`}>
                        <div className="truncate font-medium">
                          {item.mrs_ref_no}
                        </div>
                      </td>

                      <td className={`max-w-[360px] px-4 py-3 ${textClass}`}>
                        <div className="line-clamp-2">{item.description}</div>
                      </td>

                      <td className={`px-4 py-3 ${textClass}`}>{item.unit}</td>
                      <td className={`px-4 py-3 ${textClass}`}>
                        {item.quantity}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${buttonClass}`}
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            onClick={() => isOpen(item)}
                            className="flex items-center gap-1 rounded-lg bg-[#111a3d] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#0f1634]"
                          >
                            <ClipboardList size={14} />
                            Inspect
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className={`px-4 py-12 text-center ${mutedClass}`}
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                      <div className={`rounded-full p-3 ${subtleClass}`}>
                        <ClipboardList size={20} />
                      </div>
                      <p className="font-medium">No inspection records found</p>
                      <p className="text-sm">
                        Try adjusting your filters to see more results.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div
          className={`mt-4 flex flex-col gap-3 rounded-2xl border px-4 py-3 md:flex-row md:items-center md:justify-between ${isLight ? "border-slate-200 bg-white shadow-sm" : "border-slate-800 bg-slate-900/70"}`}
        >
          <p className={`text-sm ${mutedClass}`}>
            Showing {filteredData.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="flex items-center rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} className="mr-1" />
              Prev
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className={`px-2 text-sm ${mutedClass}`}>
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    currentPage === page
                      ? "bg-[#111a3d] text-white"
                      : `${buttonClass}`
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="flex items-center rounded-lg border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
      <div
        className={`mt-4 flex flex-col gap-3 rounded-2xl border px-4 py-3 ${isLight ? "border-slate-200 bg-white shadow-sm" : "border-slate-800 bg-slate-900/70"} `}
      >
        {/* Multiplier Input */}
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"}`}
        >
          <span
            className={`text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}
          >
            Rate multiplier:
          </span>
          <input
            type="number"
            min="0"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value) || 0)}
            className={`w-36 rounded-xl border px-3 py-1.5 text-sm outline-none transition focus:ring-2 focus:ring-[#111a3d] ${isLight ? "border-slate-300 bg-slate-50 text-slate-800" : "border-slate-700 bg-slate-800 text-white"}`}
            placeholder="Enter rate..."
          />
          <span className={`text-xs ${mutedClass}`}>
            × quantity = total value
          </span>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {/* Total Items */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"}`}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-[#111a3d]" />
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#111a3d]/10 text-[#111a3d]">
              <ClipboardList size={16} />
            </div>
            <p className={`text-xs ${mutedClass}`}>Total items</p>
            <p className="mt-1 text-2xl font-medium">
              {filteredData.length.toLocaleString()}
            </p>
            <p className={`mt-1 text-[11px] ${mutedClass}`}>BOQ records</p>
          </div>

          {/* BOQ Quantity */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"}`}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-blue-500" />
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Layers3 size={16} />
            </div>
            <p className={`text-xs ${mutedClass}`}>BOQ quantity</p>
            <p className="mt-1 text-2xl font-medium">
              {totalQuantity.toLocaleString()}
            </p>
            {multiplier > 0 && (
              <p className="mt-1 text-xs font-medium text-blue-600">
                = {(totalQuantity * multiplier).toLocaleString()}
              </p>
            )}
            <p className={`mt-1 text-[11px] ${mutedClass}`}>Total units</p>
          </div>

          {/* Claimed Quantity */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"}`}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-amber-500" />
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FileText size={16} />
            </div>
            <p className={`text-xs ${mutedClass}`}>Claimed quantity</p>
            <p className="mt-1 text-2xl font-medium">
              {totalClaimedQuantity.toLocaleString()}
            </p>
            {multiplier > 0 && (
              <p className="mt-1 text-xs font-medium text-amber-600">
                = {(totalClaimedQuantity * multiplier).toLocaleString()}
              </p>
            )}
            <p className={`mt-1 text-[11px] ${mutedClass}`}>
              Inspected claimed
            </p>
          </div>

          {/* Inspected Quantity */}
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-white" : "border-slate-800 bg-slate-900"}`}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-emerald-500" />
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle size={16} />
            </div>
            <p className={`text-xs ${mutedClass}`}>Inspected quantity</p>
            <p className="mt-1 text-2xl font-medium">
              {totalInspectedQuantity.toLocaleString()}
            </p>
            {multiplier > 0 && (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                = {(totalInspectedQuantity * multiplier).toLocaleString()}
              </p>
            )}
            <p className={`mt-1 text-[11px] ${mutedClass}`}>Verified units</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableThirdParty;
