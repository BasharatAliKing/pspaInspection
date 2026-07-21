import React, { useEffect, useState } from "react";
import { useTheme } from "../../components/Layout";
import Filters from "./Filters";
import { Filter, ClipboardList, Layers3 } from "lucide-react";
import TableThirdParty from "./TableThirdParty";
import ViewBOQ from "./ViewBOQ";
import BOQInspectionModal from "./BOQInspectionModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:8000";

const ThirdPartyInspection = () => {
  const { isLight } = useTheme();
  const [open, setOpen] = useState(false);
  const [boqList, setBoqList] = useState([]);
  const [selectedBOQ, setSelectedBOQ] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterValue, setFilterValue] = useState();
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [siteId,setSiteId]=useState(null);
  const handleSiteId= (id)=>{
    setSiteId(id);
  };
  const handleView = (row) => {
    setSelectedBOQ(row);
    setIsModalOpen(true);
  };

  const openInspection = (boq) => {
    setSelectedBOQ(boq);
    setIsInspectionOpen(true);
  };

  const pageClasses = isLight
    ? "min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900"
    : "min-h-screen bg-[radial-gradient(circle_at_top,_#111827_0%,_#030712_100%)] text-slate-100";

  const cardClass = isLight
    ? "border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
    : "border-slate-800 bg-slate-900/80 shadow-[0_18px_45px_rgba(0,0,0,0.35)]";

  const mutedClass = isLight ? "text-slate-500" : "text-slate-400";

  const getBOQList = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/list-boq/${filterValue ? `?contract=${filterValue}` : ""}`,
      );
      const data = await res.json();

      if (data?.data) {
        setBoqList(data.data.boqs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBOQList();
  }, [filterValue]);
console.log(siteId);
  return (
    <div className={pageClasses}>
      <main className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className={`mb-6 rounded-3xl border p-6 ${cardClass}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-[#111a3d] p-2 text-white">
                  <ClipboardList size={18} />
                </div>
                <span className="rounded-full bg-[#111a3d]/10 px-3 py-1 text-sm font-medium text-[#111a3d]">
                  Third Party Inspection
                </span>
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Inspection Dashboard</h1>
              <p className={`mt-2 text-sm sm:text-base ${mutedClass}`}>
                Review BOQ items, inspect records, and manage third-party evaluation in one place.
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#111a3d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d1530]"
            >
              <Filter size={18} />
              Apply Filter
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className={`rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/50"}`}>
              <div className="flex items-center gap-2 text-sm font-medium text-[#111a3d]">
                <Layers3 size={16} />
                Total Records
              </div>
              <p className="mt-2 text-2xl font-semibold">{boqList.length}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/50"}`}>
              <div className="text-sm font-medium text-slate-500">Inspection Status</div>
              <p className="mt-2 text-lg font-semibold">Tracked in real time</p>
            </div>
            <div className={`rounded-2xl border p-4 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-800 bg-slate-950/50"}`}>
              <div className="text-sm font-medium text-slate-500">Quick Actions</div>
              <p className="mt-2 text-lg font-semibold">View · Inspect</p>
            </div>
          </div>
        </div>

        <TableThirdParty
          isOpen={openInspection}
          handleView={handleView}
          boqList={boqList}
        />
      </main>

      <Filters filterval={setFilterValue} isOpen={open} onClose={() => setOpen(false)} handleSiteId={handleSiteId} />

      {isModalOpen && (
        <ViewBOQ
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          boqData={selectedBOQ}
        />
      )}

      {isInspectionOpen && (
        <BOQInspectionModal
          isOpen={isInspectionOpen}
          onClose={() => setIsInspectionOpen(false)}
          boqData={selectedBOQ}
          siteid={siteId}
        />
      )}
    </div>
  );
};

export default ThirdPartyInspection;
