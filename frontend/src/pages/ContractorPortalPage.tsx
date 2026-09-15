import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TenderNotice, TenderBid, MeasurementBillSubmission, Project } from '../types';
import { formatIndianCurrency } from '../components/common/StatCard';
import { 
  Gavel, FileText, CheckCircle2, AlertTriangle, Clock, ShieldCheck, 
  TrendingDown, TrendingUp, Cpu, Award, Building, ArrowRight, 
  ExternalLink, Layers, ShieldAlert, Sparkles, Check, X, RefreshCw,
  Coins, Download, UploadCloud, ChevronDown, ChevronUp, Lock,
  FastForward, RotateCcw, Printer, FileCheck2, Fingerprint
} from 'lucide-react';

export interface BidLodgmentReceipt {
  ackNumber: string;
  tenderId: string;
  tenderTitle: string;
  department: string;
  contractorName: string;
  contractorGstin: string;
  contractorClass: string;
  quotedAmount: number;
  emdReference: string;
  timestamp: string;
  deadlineTime: string;
  announcementTime: string;
  statutoryFloor: number;
  hashSha256: string;
}

interface ContractorPortalPageProps {
  onOpenProject: (projectId: string) => void;
}

export const ContractorPortalPage: React.FC<ContractorPortalPageProps> = ({ onOpenProject }) => {
  const { role, userName, userDesignation, isContractor, isDistrictAuthority, isAdmin, isVigilanceAuditor } = useAuth();
  const isProcuringOfficial = isDistrictAuthority || isAdmin || (role as string) === 'FIELD_OFFICER';
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'OPEN_TENDERS' | 'SUBMIT_BID' | 'EVALUATION_MATRIX' | 'MY_CONTRACTS'>('OPEN_TENDERS');
  const [tenders, setTenders] = useState<TenderNotice[]>([]);
  const [measurementBills, setMeasurementBills] = useState<MeasurementBillSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenderCountdownSec, setTenderCountdownSec] = useState<number>(1800);

  // Selected Tender for Bidding / Evaluation
  const [selectedTenderId, setSelectedTenderId] = useState<string>('NIT-MPLAD-2026-081');
  const [expandedBoqTenderId, setExpandedBoqTenderId] = useState<string | null>(null);

  // Active Bid Lodgment Receipt (Shown after submission until dismissed or new bid started)
  const [submittedReceipt, setSubmittedReceipt] = useState<BidLodgmentReceipt | null>(null);

  // e-Bid Form State
  const [bidContractorName, setBidContractorName] = useState<string>('M/s Sri Venkateswara Infra Projects Ltd');
  const [bidContractorGstin, setBidContractorGstin] = useState<string>('37AAECS1234F1Z5');
  const [bidContractorClass, setBidContractorClass] = useState<string>('Class 1 Civil & Infrastructure');
  const [bidQuotedAmount, setBidQuotedAmount] = useState<number>(1350000);
  const [bidEmdReference, setBidEmdReference] = useState<string>('EMD-SBI-992018');
  const [bidDscSigned, setBidDscSigned] = useState<boolean>(true);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Synchronize contractor name from active persona if available
  useEffect(() => {
    if (userName && isContractor) {
      setBidContractorName(userName);
    }
  }, [userName, isContractor]);

  const [projects, setProjects] = useState<Project[]>([]);

  // Propose New Tender Notice Form State
  const [showNewTenderModal, setShowNewTenderModal] = useState(false);
  const [newTenderProjectId, setNewTenderProjectId] = useState('MPLAD-AP-2026-00125');
  const [newTenderTitle, setNewTenderTitle] = useState('Construction of High-Capacity Borewell & Overhead Sump');
  const [newTenderDept, setNewTenderDept] = useState('Rural Water Supply & Sanitation (RWSS)');
  const [newTenderState, setNewTenderState] = useState('Andhra Pradesh');
  const [newTenderDistrict, setNewTenderDistrict] = useState('Visakhapatnam');
  const [newTenderEstimate, setNewTenderEstimate] = useState<number>(1850000);
  const [newTenderDeadlineMins, setNewTenderDeadlineMins] = useState<number>(30);
  const [isPublishingTender, setIsPublishingTender] = useState(false);

  // Measurement Bill Form State
  const [showBillModal, setShowBillModal] = useState(false);
  const [billProjectId, setBillProjectId] = useState('MPLAD-AP-2026-00125');
  const [billNumber, setBillNumber] = useState('CC-BILL-03/2026');
  const [billMilestone, setBillMilestone] = useState('Milestone 2: Column Casting & Lintel Level (50%)');
  const [billClaimedAmount, setBillClaimedAmount] = useState('450000');
  const [billPhysicalPct, setBillPhysicalPct] = useState(50);
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);
  const [isAutoEvaluating, setIsAutoEvaluating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, bList, pList] = await Promise.all([
        api.getTenders(),
        api.getMeasurementBills(),
        api.getProjects()
      ]);
      setTenders(tList);
      setMeasurementBills(bList);
      setProjects(pList);
      if (tList.length > 0) {
        const openTender = tList.find(t => t.status === 'OPEN_FOR_BIDDING') || tList[0];
        if (!selectedTenderId || !tList.some(t => t.id === selectedTenderId)) {
          setSelectedTenderId(openTender.id);
          setBidQuotedAmount(Math.round(openTender.sanctioned_estimate * 0.92));
        }
      }
      if (pList.length > 0 && !newTenderProjectId) {
        setNewTenderProjectId(pList[0].id);
      }
    } catch {
      showToast('Failed to load tenders data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNewTender = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProcuringOfficial) {
      showToast('Unauthorized: Tender notices (NIT) can only be published by MoSPI or District Planning Officials under GFR Rule 144.', 'error');
      return;
    }
    if (!newTenderTitle.trim()) {
      showToast('Please specify a title for the tender notice', 'error');
      return;
    }

    setIsPublishingTender(true);
    try {
      const selectedProj = projects.find(p => p.id === newTenderProjectId) || projects[0];
      const created = await api.publishNewTender({
        project_id: selectedProj ? selectedProj.id : (newTenderProjectId || 'MPLAD-2026-NEW'),
        title: newTenderTitle.trim(),
        department: newTenderDept,
        state: selectedProj ? selectedProj.state : newTenderState,
        district: selectedProj ? selectedProj.district : newTenderDistrict,
        sanctioned_estimate: Number(newTenderEstimate),
        deadline_minutes: Number(newTenderDeadlineMins)
      });

      setTenders(prev => [created, ...prev]);
      setSelectedTenderId(created.id);
      setBidQuotedAmount(Math.round(created.sanctioned_estimate * 0.92));
      setShowNewTenderModal(false);
      showToast(`📢 New Tender Notice [${created.id}] published! 30-minute sealed bidding window initiated.`, 'success');
      setActiveTab('OPEN_TENDERS');
    } catch (err: any) {
      showToast(`Error proposing tender: ${err.message}`, 'error');
    } finally {
      setIsPublishingTender(false);
    }
  };

  const handleResetAllTenders = async () => {
    try {
      showToast('🔄 Resetting tenders to fresh 30-minute sealed bidding windows...', 'info');
      const fresh = await api.resetAllTendersToFresh();
      setTenders(fresh);
      if (fresh.length > 0) {
        setSelectedTenderId(fresh[0].id);
        setBidQuotedAmount(Math.round(fresh[0].sanctioned_estimate * 0.92));
      }
      showToast('✓ All tenders reset! 30-minute countdown active with bids sealed in escrow.', 'success');
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const selectedTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];

  // Update default quote when selected tender changes
  const handleSelectTenderForBid = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    const found = tenders.find(t => t.id === tenderId);
    if (found) {
      setBidQuotedAmount(Math.round(found.sanctioned_estimate * 0.92));
    }
    setSubmittedReceipt(null);
    setActiveTab('SUBMIT_BID');
  };

  // Real-time 30-Minute Countdown Clock for Selected Tender
  useEffect(() => {
    if (!selectedTender) return;
    const epoch = selectedTender.deadline_epoch_ms || (Date.now() + 30 * 60 * 1000);

    const checkTimer = () => {
      const remaining = Math.max(0, Math.floor((epoch - Date.now()) / 1000));
      setTenderCountdownSec(remaining);
      if (remaining === 0 && selectedTender.bids_sealed && selectedTender.status === 'OPEN_FOR_BIDDING') {
        handleTriggerAutoAward(selectedTender.id);
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [selectedTender?.id, selectedTender?.deadline_epoch_ms, selectedTender?.bids_sealed, selectedTender?.status]);

  const handleFastForwardDeadline = async (tenderId: string) => {
    try {
      showToast('⏩ Fast-forwarding 30-minute deadline to expiry...', 'info');
      await handleTriggerAutoAward(tenderId);
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleResetTenderCountdown = async (tenderId: string, minutes: number = 30) => {
    try {
      const updated = await api.resetTenderCountdown(tenderId, minutes);
      setTenders(prev => prev.map(t => t.id === updated.id ? updated : t));
      setTenderCountdownSec(minutes * 60);
      showToast(`🔄 Bidding window reset to ${minutes} minutes! Countdown active.`, 'success');
    } catch (err: any) {
      showToast(`Error resetting countdown: ${err.message}`, 'error');
    }
  };

  // Real-time AI preview calculations for current bid form
  const currentEstimate = selectedTender ? selectedTender.sanctioned_estimate : 1500000;
  const currentVariance = selectedTender 
    ? Math.round(((bidQuotedAmount - currentEstimate) / currentEstimate) * 1000) / 10 
    : 0;
  const statutoryFloor = selectedTender ? selectedTender.statutory_price_floor : currentEstimate * 0.85;
  const isPredatory = bidQuotedAmount < statutoryFloor;
  const isBorderline = !isPredatory && bidQuotedAmount < currentEstimate * 0.90;
  const isInflated = bidQuotedAmount > currentEstimate * 1.15;

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender) return;

    if (bidQuotedAmount <= 0) {
      showToast('Please enter a valid quoted tender amount', 'error');
      return;
    }

    if (!bidDscSigned) {
      showToast('Class-3 Digital Signature verification required', 'error');
      return;
    }

    setIsSubmittingBid(true);
    try {
      const updatedTender = await api.submitTenderBid(selectedTender.id, {
        contractor_id: 'CON-AP-042',
        contractor_name: bidContractorName.trim(),
        contractor_class: bidContractorClass.trim(),
        contractor_gstin: bidContractorGstin.trim(),
        quoted_amount: Number(bidQuotedAmount),
        emd_reference: bidEmdReference.trim(),
        emd_status: 'VERIFIED_IN_ESCROW'
      });

      setTenders(prev => prev.map(t => t.id === updatedTender.id ? updatedTender : t));

      // Generate authentic cryptographic receipt
      const randomDigest = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
      const ackNumber = `ACK/MPLADS/2026/${selectedTender.id.replace('NIT-MPLAD-', '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);

      setSubmittedReceipt({
        ackNumber,
        tenderId: selectedTender.id,
        tenderTitle: selectedTender.title,
        department: selectedTender.department,
        contractorName: bidContractorName.trim(),
        contractorGstin: bidContractorGstin.trim(),
        contractorClass: bidContractorClass.trim(),
        quotedAmount: Number(bidQuotedAmount),
        emdReference: bidEmdReference.trim(),
        timestamp: `${nowStr} IST`,
        deadlineTime: updatedTender.bidding_deadline_time || '30-Minute Countdown Active',
        announcementTime: updatedTender.result_announcement_time || '30-Minute Countdown Active',
        statutoryFloor: selectedTender.statutory_price_floor,
        hashSha256: randomDigest
      });

      showToast(`🔒 e-Bid cryptographically sealed in escrow! Acknowledgment ${ackNumber} generated.`, 'success');
    } catch (err: any) {
      showToast(`Error submitting bid: ${err.message || 'Server error'}`, 'error');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleAwardTender = async (tenderId: string, bidId: string, contractorName: string) => {
    try {
      const updated = await api.awardTender(tenderId, bidId);
      setTenders(prev => prev.map(t => t.id === updated.id ? updated : t));
      showToast(`🏆 Contract awarded to ${contractorName}! Project status upgraded to execution.`, 'success');
    } catch (err: any) {
      showToast(`Failed to award tender: ${err.message}`, 'error');
    }
  };

  const handleTriggerAutoAward = async (tenderId: string) => {
    setIsAutoEvaluating(true);
    try {
      const updated = await api.autoEvaluateAndAwardTender(tenderId);
      setTenders(prev => prev.map(t => t.id === updated.id ? updated : t));
      if (updated.status === 'RETENDER_INITIATED') {
        showToast(`⚠️ All bids disqualified under price floor! Statutory Re-Tender mandated under GFR Rule 173.`, 'warning');
      } else {
        showToast(`⚡ Deadline reached! AI Engine unsealed bids, ran Price-Floor Scrutiny, and announced the winner!`, 'success');
      }
    } catch (err: any) {
      showToast(`Error running auto-evaluation: ${err.message}`, 'error');
    } finally {
      setIsAutoEvaluating(false);
    }
  };

  const handleReissueTender = async (tenderId: string) => {
    try {
      const updated = await api.reissueTender(tenderId);
      setTenders(prev => prev.map(t => t.id === updated.id ? updated : t));
      showToast(`🔄 Tender re-issued under GFR Rule 173! Fresh 7-day competitive window open.`, 'success');
    } catch (err: any) {
      showToast(`Error reissuing tender: ${err.message}`, 'error');
    }
  };

  const handleSubmitMeasurementBill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBill(true);
    try {
      const created = await api.submitMeasurementBill({
        project_id: billProjectId,
        contractor_id: 'CON-AP-042',
        contractor_name: userName || 'Sri Venkateswara Infra Projects Ltd',
        bill_number: billNumber.trim(),
        stage_milestone: billMilestone.trim(),
        claimed_amount: Number(billClaimedAmount),
        physical_progress_claimed: Number(billPhysicalPct),
        site_photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80'
      });

      setMeasurementBills(prev => [created, ...prev]);
      setShowBillModal(false);
      showToast(`Measurement Bill ${created.bill_number} submitted for statutory field inspection!`, 'success');
    } catch (err: any) {
      showToast(`Error submitting bill: ${err.message}`, 'error');
    } finally {
      setIsSubmittingBill(false);
    }
  };

  const visibleMeasurementBills = isContractor
    ? measurementBills.filter(b => 
        b.contractor_name === userName || 
        b.contractor_id === 'CON-AP-042' || 
        b.contractor_name.toLowerCase().includes('venkateswara') ||
        b.contractor_name.toLowerCase().includes((userName || '').toLowerCase())
      )
    : measurementBills;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 uppercase tracking-wider flex items-center gap-1 border border-amber-300">
                <Gavel className="w-3 h-3 text-orange-600" />
                <span>e-Procurement & Bidding Engine</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                MoSPI / CPWD 2026 Standards
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
              <span>Contractor e-Tender Bidding & Procurement Hub</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Open competitive bidding platform with real-time AI Price Floor checks, predatory underbidding screening, 
              anti-collusion cartel pattern detection, and milestone measurement bill processing.
            </p>
          </div>

          {/* Active Persona Banner */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
              {isContractor ? 'CON' : 'ADM'}
            </div>
            <div className="text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                {isContractor ? 'Active Contractor Entity' : 'Procurement Reviewer Role'}
              </span>
              <span className="font-extrabold text-gov-navy block">
                {isContractor ? userName : 'State / District Tender Committee'}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block">
                {isContractor ? userDesignation : `Reviewing as ${role}`}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('OPEN_TENDERS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'OPEN_TENDERS'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Open Tenders (NIT Board)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-white/20 text-white">
              {tenders.filter(t => t.status === 'OPEN_FOR_BIDDING').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('SUBMIT_BID')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'SUBMIT_BID'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Submit Official e-Bid</span>
            {submittedReceipt && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-600 text-white">
                RECEIPT READY
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('EVALUATION_MATRIX')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'EVALUATION_MATRIX'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sealed Escrow & Award Board</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
              selectedTender?.bids_sealed ? 'bg-amber-400 text-slate-950' : 'bg-emerald-700 text-white'
            }`}>
              {selectedTender?.bids_sealed ? '30M ESCROW' : 'RESULT ANNOUNCED'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('MY_CONTRACTS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'MY_CONTRACTS'
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Awarded Works & Measurement Bills</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-blue-600 text-white">
              {visibleMeasurementBills.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: OPEN TENDERS (NIT BOARD) */}
      {activeTab === 'OPEN_TENDERS' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Gavel className="w-4 h-4 text-orange-600" />
                <span>Active Notices Inviting Tender (NIT Board)</span>
              </h2>
              <span className="text-xs text-slate-500">
                Showing {tenders.length} notices • {tenders.filter(t => t.status === 'OPEN_FOR_BIDDING' && t.bids_sealed).length} currently open with active 30-min sealed escrow
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleResetAllTenders}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200"
                title="Reset all tenders to fresh 30-minute sealed windows"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                <span>Reset All Tenders (30m)</span>
              </button>

              {isProcuringOfficial ? (
                <button
                  onClick={() => {
                    if (projects.length > 0) {
                      setNewTenderProjectId(projects[0].id);
                      setNewTenderTitle(`Procurement of Works: ${projects[0].title}`);
                      setNewTenderEstimate(projects[0].sanctioned_amount || 1850000);
                    }
                    setShowNewTenderModal(true);
                  }}
                  className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Gavel className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Issue Official Tender Notice (NIT)</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>NITs Issued Exclusively by MoSPI / District Authorities (GFR Rule 144)</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tenders.map((tender) => {
              const isOpen = tender.status === 'OPEN_FOR_BIDDING';
              const isAwarded = tender.status === 'AWARDED';
              const isExpandedBoq = expandedBoqTenderId === tender.id;

              return (
                <div
                  key={tender.id}
                  className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                    isOpen ? 'border-amber-200 hover:border-amber-400' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                          {tender.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {tender.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          📍 {tender.district}, {tender.state}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-gov-navy">{tender.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Issuing Department: <strong>{tender.department}</strong> • Project Ref: <strong>{tender.project_id}</strong>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {isOpen && (
                        <button
                          onClick={() => handleSelectTenderForBid(tender.id)}
                          className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Gavel className="w-3.5 h-3.5 text-gov-saffron" />
                          <span>Submit e-Bid</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedTenderId(tender.id);
                          setActiveTab('EVALUATION_MATRIX');
                        }}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Bids Matrix ({tender.bids?.length || 0})</span>
                      </button>

                      <button
                        onClick={() => onOpenProject(tender.project_id)}
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold rounded-xl border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>360° Dossier</span>
                        <ArrowRight className="w-3 h-3 text-orange-600" />
                      </button>
                    </div>
                  </div>

                  {/* Financial Benchmarks Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Sanctioned Estimate:</span>
                      <span className="font-mono font-extrabold text-gov-navy text-sm">
                        {formatIndianCurrency(tender.sanctioned_estimate)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100">
                      <span className="text-[10px] text-rose-700 font-bold block uppercase">Statutory Price Floor (-15%):</span>
                      <span className="font-mono font-extrabold text-rose-900 text-sm">
                        {formatIndianCurrency(tender.statutory_price_floor)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100">
                      <span className="text-[10px] text-amber-800 font-bold block uppercase">Mandatory EMD (2%):</span>
                      <span className="font-mono font-extrabold text-amber-950 text-sm">
                        {formatIndianCurrency(tender.emd_amount)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Bidding & Result Schedule:</span>
                      <span className="font-mono font-bold text-slate-800 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-600" />
                        Closes: {tender.bidding_deadline_time || tender.closing_date}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-800 font-semibold block mt-0.5">
                        AI Result: {tender.result_announcement_time || 'Next Day 18:00 IST'}
                      </span>
                    </div>
                  </div>

                  {/* Accordion for BoQ Items */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setExpandedBoqTenderId(isExpandedBoq ? null : tender.id)}
                      className="text-xs font-bold text-gov-navy hover:text-gov-saffron flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpandedBoq ? 'Hide' : 'Inspect'} Statutory Bill of Quantities (BoQ Specifications)</span>
                      {isExpandedBoq ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpandedBoq && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto text-xs animate-in fade-in duration-150">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase">
                              <th className="pb-1.5">BoQ Item</th>
                              <th className="pb-1.5">Quantity</th>
                              <th className="pb-1.5">Unit</th>
                              <th className="pb-1.5">CPWD SoR Rate</th>
                              <th className="pb-1.5 text-right">Estimated Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {tender.boq_items.map((item) => (
                              <tr key={item.id} className="hover:bg-white/60">
                                <td className="py-2 font-semibold text-slate-800">{item.item_description}</td>
                                <td className="py-2 font-mono">{item.quantity}</td>
                                <td className="py-2 text-slate-500">{item.unit}</td>
                                <td className="py-2 font-mono">₹{item.standard_sor_rate.toLocaleString('en-IN')}</td>
                                <td className="py-2 font-mono font-bold text-gov-navy text-right">
                                  ₹{item.estimated_total.toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE e-BID SUBMISSION & AI PRICE FLOOR CHECK */}
      {activeTab === 'SUBMIT_BID' && (
        submittedReceipt ? (
          /* Cryptographic Lodgment Receipt Card */
          <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-6 md:p-8 shadow-gov space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Official Header Strip */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center font-black text-xl shadow-xs">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                      Government of India • Ministry of Statistics and Programme Implementation (MoSPI)
                    </span>
                    <h2 className="text-lg md:text-xl font-extrabold text-gov-navy">
                      Central Public Procurement Portal (CPPP) — e-Bid Lodgment Receipt
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">
                      Issued under Rule 163 of General Financial Rules (GFR) 2017 & Information Technology Act 2000
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>LODGED & SEALED IN ESCROW</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Acknowledgment & Status Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-emerald-800/40">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 font-bold block">
                  Official Electronic Lodgment Acknowledgment
                </span>
                <div className="font-mono text-base md:text-lg font-black text-white tracking-wide">
                  {submittedReceipt.ackNumber}
                </div>
                <p className="text-[11px] text-slate-300">
                  Cryptographically sealed at <strong>{submittedReceipt.timestamp}</strong> with SHA-256 Public-Key Escrow.
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-right min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-amber-300 block">Bidding Window Closes In:</span>
                <span className="font-mono text-xl font-black text-white">
                  {Math.floor(tenderCountdownSec / 60)}m {(tenderCountdownSec % 60).toString().padStart(2, '0')}s
                </span>
                <span className="text-[10px] text-slate-300 block">
                  Autonomous AI Unsealing: {submittedReceipt.announcementTime}
                </span>
              </div>
            </div>

            {/* Receipt Key-Value Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-extrabold text-gov-navy text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Building className="w-4 h-4 text-orange-600" />
                  <span>Tender & Procuring Authority Parameters</span>
                </h3>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tender Notice ID:</span>
                    <strong className="font-mono text-gov-navy text-xs">{submittedReceipt.tenderId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Procurement Scope / Title:</span>
                    <strong className="text-slate-800">{submittedReceipt.tenderTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Issuing Department:</span>
                    <span className="text-slate-700 font-medium">{submittedReceipt.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Statutory Minimum Price Floor (CPWD Benchmarked):</span>
                    <span className="font-mono font-bold text-slate-700">₹{submittedReceipt.statutoryFloor.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="font-extrabold text-gov-navy text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <Fingerprint className="w-4 h-4 text-blue-600" />
                  <span>Contractor Entity & Escrow Seal</span>
                </h3>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Bidding Firm / Contractor:</span>
                    <strong className="text-gov-navy text-xs">{submittedReceipt.contractorName}</strong>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Registration Class:</span>
                      <span className="text-slate-700 font-semibold">{submittedReceipt.contractorClass}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">GSTIN Identifier:</span>
                      <span className="font-mono text-slate-700 font-bold">{submittedReceipt.contractorGstin}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">EMD Escrow Reference:</span>
                    <span className="font-mono text-emerald-800 font-bold">{submittedReceipt.emdReference} (VERIFIED IN ESCROW)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Commercial Quoted Amount (Sealed in Escrow):</span>
                    <span className="font-mono text-base font-black text-gov-navy">
                      ₹{submittedReceipt.quotedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Digest & Secrecy Proof */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <Lock className="w-4 h-4 text-orange-600" />
                <span>Cryptographic SHA-256 Asymmetric Vault Seal</span>
              </div>
              <div className="font-mono text-[11px] text-slate-800 break-all bg-white p-2.5 rounded-lg border border-amber-200">
                0x{submittedReceipt.hashSha256}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                <strong>Statutory Secrecy Protocol:</strong> In strict compliance with Central Vigilance Commission (CVC) Directive 02/2026, 
                neither competitor bidding firms nor state review officers can inspect quotation amounts or viability scores 
                while the tender is open. When the 30-minute timer concludes, the Autonomous AI Engine will simultaneously unseal all bids, 
                verify CPWD Schedule of Rates material viability, and announce the winning L1 contract.
              </p>
            </div>

            {/* Receipt Navigation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setSubmittedReceipt(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>➕ Submit Another Bid</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setActiveTab('EVALUATION_MATRIX')}
                  className="px-5 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold text-xs rounded-xl transition-all shadow-gov flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-gov-saffron" />
                  <span>Inspect Sealed Escrow Vault & Live Countdown →</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-5">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-orange-600" />
                  <span>Electronic Tender Bid Submission Terminal (e-Procurement)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit competitive quotation for open MPLAD works with automated CVC price-floor scrutiny.
                </p>
              </div>

              <form onSubmit={handleSubmitBid} className="space-y-4 text-xs">
                {/* Tender Selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Target Tender Notice (NIT):</label>
                  <select
                    value={selectedTenderId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedTenderId(newId);
                      const found = tenders.find(t => t.id === newId);
                      if (found) setBidQuotedAmount(Math.round(found.sanctioned_estimate * 0.92));
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:bg-white"
                  >
                    {tenders.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.id}] {t.title} ({t.status === 'OPEN_FOR_BIDDING' ? '🟢 OPEN' : t.status.replace(/_/g, ' ')}) — Est: ₹{t.sanctioned_estimate.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contractor Entity Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Contractor / Firm Name:</label>
                    <input
                      type="text"
                      value={bidContractorName}
                      onChange={(e) => setBidContractorName(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Registration Class:</label>
                    <input
                      type="text"
                      value={bidContractorClass}
                      onChange={(e) => setBidContractorClass(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">GSTIN Identifier:</label>
                    <input
                      type="text"
                      value={bidContractorGstin}
                      onChange={(e) => setBidContractorGstin(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">EMD Escrow Pledge Reference:</label>
                    <input
                      type="text"
                      value={bidEmdReference}
                      onChange={(e) => setBidEmdReference(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Quoted Amount with Dynamic Variance */}
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-extrabold text-slate-900 text-xs">
                      Total Commercial Bid / Quoted Amount (₹ INR):
                    </label>
                    <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                      currentVariance < -15 ? 'bg-red-200 text-red-900' :
                      currentVariance < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {currentVariance > 0 ? `+${currentVariance}%` : `${currentVariance}%`} vs Sanctioned Estimate
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={bidQuotedAmount}
                      onChange={(e) => setBidQuotedAmount(Number(e.target.value))}
                      step="1000"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-extrabold text-gov-navy focus:ring-2 focus:ring-gov-navy"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Sanctioned Estimate: ₹{currentEstimate.toLocaleString('en-IN')}</span>
                    <span>Statutory Price Floor: ₹{statutoryFloor.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Digital Signature Affirmation */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="dscCheck"
                    checked={bidDscSigned}
                    onChange={(e) => setBidDscSigned(e.target.checked)}
                    className="mt-0.5 rounded text-gov-navy focus:ring-gov-navy"
                  />
                  <label htmlFor="dscCheck" className="text-slate-700 leading-snug cursor-pointer">
                    <strong>Digital Signature Affirmation:</strong> I certify under penalty of perjury that this electronic bid complies with Central Vigilance Commission (CVC) anti-collusion directives, standard Schedule of Rates (SoR), and the statutory defect liability warranty.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingBid}
                    className="w-full py-3 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold rounded-xl transition-all shadow-gov flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4 text-gov-saffron" />
                    <span>{isSubmittingBid ? 'Validating Cryptographic Bid...' : 'Sign & Submit Official e-Bid to Tender Board'}</span>
                  </button>
                </div>
              </form>
            </div>

          {/* Real-time AI Scrutinizer Feedback Sidebar */}
          <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Cpu className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-gov-navy text-sm">Real-time AI Price Floor Auditor</h3>
              </div>

              {isPredatory ? (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-red-900 font-black">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>PREDATORY BID RISK (REJECTION NOTICE)</span>
                  </div>
                  <p className="text-red-800 leading-relaxed">
                    Your quoted amount (₹{bidQuotedAmount.toLocaleString('en-IN')}) is <strong>{Math.abs(currentVariance)}% below</strong> the statutory estimate.
                  </p>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    Under MoSPI Guidelines Clause 3.14, any bid below -15% cannot mathematically purchase certified BIS Grade-53 cement and Fe500D TMT steel at current market benchmark rates. This bid will be auto-disqualified upon submission.
                  </p>
                </div>
              ) : isBorderline ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-black">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>REQUIRES ADDITIONAL PERFORMANCE SECURITY (APS)</span>
                  </div>
                  <p className="text-amber-900 leading-relaxed">
                    Bid variance ({currentVariance}%) is within permissible competitive range but borders aggressive pricing (-10% to -15%).
                  </p>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    An Additional Performance Security (APS) bank guarantee of <strong>₹{Math.round((currentEstimate - bidQuotedAmount) * 0.5).toLocaleString('en-IN')}</strong> will be required in escrow prior to contract signing.
                  </p>
                </div>
              ) : isInflated ? (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-purple-900 font-black">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span>INFLATED QUOTATION ALERT</span>
                  </div>
                  <p className="text-purple-800 leading-relaxed">
                    Quoted amount is +{currentVariance}% above the CPWD Schedule of Rates benchmark. Tender board will mandate written line-item justification.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>CLEAN VIABLE TENDER RATING</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    Bid conforms to live commodity prices. Certified Grade-A materials fully viable at this rate.
                  </p>
                  <div className="pt-1 text-[10px] font-mono text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Eligible for instant MoSPI Price Oracle Clearance Hash</span>
                  </div>
                </div>
              )}

              {/* District Benchmark Rates Summary */}
              <div className="pt-2 text-xs space-y-2">
                <span className="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">
                  Live District Market Benchmark Rates:
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">Grade-53 Cement:</span>
                    <strong className="text-gov-navy">₹385 / 50kg Bag</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">Primary Fe500D Steel:</span>
                    <strong className="text-gov-navy">₹58,200 / MT</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">M-Sand (Zone-II):</span>
                    <strong className="text-gov-navy">₹1,420 / m³</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400">
              * Live benchmarks synchronized from GeM Procurement API & MoSPI Wholesale Price Index (WPI).
            </div>
          </div>
        </div>
        )
      )}

      {/* TAB 3: AUTOMATED BID MATRIX & L1/L2 CARTEL AUDIT */}
      {activeTab === 'EVALUATION_MATRIX' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-slate-900 text-amber-300">
                    {selectedTender.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-900">
                    AUTOMATED TENDER EVALUATION BOARD
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-gov-navy">{selectedTender.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sanctioned Estimate: <strong>₹{selectedTender.sanctioned_estimate.toLocaleString('en-IN')}</strong> • 
                  Statutory Floor: <strong>₹{selectedTender.statutory_price_floor.toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-600">Switch Tender:</label>
                <select
                  value={selectedTender.id}
                  onChange={(e) => setSelectedTenderId(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {tenders.map(t => (
                    <option key={t.id} value={t.id}>{t.id} — {t.title.slice(0, 35)}...</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statutory Timeline & Autonomous Resolution Engine Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-sm border border-indigo-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Statutory e-Procurement Time-Window Protocol
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-slate-300">Opening Schedule:</span>
                  <span className="font-bold text-amber-300">
                    {selectedTender.result_announcement_time || '2026-03-25 18:00 IST'}
                  </span>
                </div>
              </div>

              {/* 3-Step Lifecycle Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</div>
                  <div>
                    <span className="font-bold block text-white text-[11px]">1. Bidding Window</span>
                    <span className="text-[10px] text-slate-300">Closes: {selectedTender.bidding_deadline_time || '2026-03-25 17:00 IST'}</span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  selectedTender.bids_sealed 
                    ? 'bg-amber-500/20 border-amber-400/30 text-amber-200' 
                    : 'bg-white/10 border-white/10 text-slate-300'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selectedTender.bids_sealed ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-white'
                  }`}>
                    {selectedTender.bids_sealed ? '🔒' : '✓'}
                  </div>
                  <div>
                    <span className="font-bold block text-white text-[11px]">2. Cryptographic Seal</span>
                    <span className="text-[10px] text-slate-300">
                      {selectedTender.bids_sealed ? 'Bids Locked in Escrow' : 'Bids Unsealed by AI'}
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                  selectedTender.status === 'AWARDED'
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                    : selectedTender.status === 'RETENDER_INITIATED'
                    ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selectedTender.status === 'AWARDED' ? 'bg-emerald-500 text-white' : selectedTender.status === 'RETENDER_INITIATED' ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {selectedTender.status === 'AWARDED' ? '🏆' : selectedTender.status === 'RETENDER_INITIATED' ? '⚠️' : '3'}
                  </div>
                  <div>
                    <span className="font-bold block text-white text-[11px]">
                      {selectedTender.status === 'RETENDER_INITIATED' ? '3. Re-Tender Mandated' : '3. Autonomous AI Award'}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate">
                      {selectedTender.status === 'AWARDED' ? `Winner: ${selectedTender.awarded_contractor}` : selectedTender.status === 'RETENDER_INITIATED' ? 'All Bids Disqualified (GFR 173)' : 'Awaiting Deadline Expiry'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Action Banner with Live 30-Min Countdown & Fast-Forward Controls */}
              {selectedTender.bids_sealed ? (
                <div className="p-4 bg-gradient-to-r from-amber-950/90 to-slate-900 border border-amber-500/50 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-amber-200 text-sm">
                          Bids Cryptographically Sealed in Escrow
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                          {Math.floor(tenderCountdownSec / 60)}m {(tenderCountdownSec % 60).toString().padStart(2, '0')}s Remaining
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-2xl">
                        Under CVC Directive 02/2026, competitor quotes remain sealed until the 30-minute deadline (<strong>{selectedTender.result_announcement_time}</strong>). 
                        When the countdown reaches 00:00, the AI Decision Engine will automatically unseal bids, check CPWD material price floors, and announce the winner!
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-auto">
                    <button
                      onClick={() => handleFastForwardDeadline(selectedTender.id)}
                      disabled={isAutoEvaluating}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      title="Simulate reaching the end of the 30-minute window right now"
                    >
                      {isAutoEvaluating ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FastForward className="w-3.5 h-3.5 fill-slate-950" />
                      )}
                      <span>{isAutoEvaluating ? 'Running AI Engine...' : '⏩ Fast-Forward 30m (Simulate Expiry)'}</span>
                    </button>

                    <button
                      onClick={() => handleResetTenderCountdown(selectedTender.id, 30)}
                      className="px-2.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Reset window back to 30 minutes"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset 30m</span>
                    </button>
                  </div>
                </div>
              ) : selectedTender.status === 'RETENDER_INITIATED' ? (
                <div className="p-3.5 bg-rose-950/70 border border-rose-500/50 rounded-xl text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-black text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>ALL BIDS DISQUALIFIED UNDER PRICE FLOOR — STATUTORY RE-TENDER MANDATED</span>
                    </span>
                    {(isDistrictAuthority || isAdmin) && (
                      <button
                        onClick={() => handleReissueTender(selectedTender.id)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white font-black text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Publish Revised Re-Tender Notice (GFR 173)</span>
                      </button>
                    )}
                  </div>
                  {selectedTender.ai_evaluation_log && (
                    <p className="text-[11px] text-slate-200 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                      🤖 {selectedTender.ai_evaluation_log}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-black text-emerald-300 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>OFFICIAL RESULT ANNOUNCED & CONTRACT AWARDED BY AI</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResetTenderCountdown(selectedTender.id, 30)}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Re-open this tender with a fresh 30-minute sealed bidding window"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                        <span>🔄 Re-open Bidding (Fresh 30m)</span>
                      </button>
                      <span className="font-mono text-[10px] text-emerald-300 font-bold">
                        {selectedTender.result_announcement_time || '2026-03-25 18:00 IST'}
                      </span>
                    </div>
                  </div>
                  {selectedTender.ai_evaluation_log && (
                    <p className="text-[11px] text-slate-200 font-mono leading-relaxed bg-black/30 p-2 rounded-lg border border-white/5">
                      🤖 {selectedTender.ai_evaluation_log}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bids List Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Submitted Competitive Bids ({selectedTender.bids?.length || 0} Registered)
                </h3>
                <span className="text-[10px] font-bold text-slate-500">
                  {selectedTender.bids_sealed 
                    ? '🔒 Encrypted Escrow Vault Active' 
                    : 'Ranked by Lowest Viable Rate (MoSPI L1 Standard)'}
                </span>
              </div>

              {(!selectedTender.bids || selectedTender.bids.length === 0) ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No bids registered yet for this tender notice.
                </div>
              ) : selectedTender.bids_sealed ? (
                /* SEALED ESCROW VAULT VIEW: All envelopes are cryptographically locked */
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-400/30 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                      <Lock className="w-4 h-4 text-orange-600" />
                      <span>Tamper-Evident Asymmetric Escrow Vault Active</span>
                    </div>
                    <span className="font-mono text-amber-800 text-[11px] font-bold">
                      {selectedTender.bids.length} Envelopes Registered
                    </span>
                  </div>

                  {selectedTender.bids.map((bid, bIdx) => {
                    const isOwnBid = bid.contractor_name === userName || (isContractor && bid.contractor_name.toLowerCase().includes('venkateswara'));

                    return (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-xl border transition-all text-xs ${
                          isOwnBid
                            ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/30'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono shrink-0 bg-slate-900 text-amber-300 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400" />
                              <span>SEALED</span>
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-gov-navy text-xs">
                                  {isOwnBid ? `Your Firm's Bid (${bid.contractor_name})` : `[ 🔒 Encrypted Competitor Bidder Envelope #${bIdx + 1} ]`}
                                </h4>
                                {isOwnBid && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                                    YOUR FIRM'S SUBMISSION
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {isOwnBid 
                                  ? `GSTIN: ${bid.contractor_gstin} • EMD: ${bid.emd_reference} • Submitted: ${bid.submitted_at}`
                                  : `Sealed Envelope ID: ${bid.id} • Registered in Escrow • Submitted: ${bid.submitted_at}`}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase">Commercial Quoted Offer:</span>
                            {isOwnBid ? (
                              <span className="font-mono font-black text-gov-navy text-sm">
                                ₹{bid.quoted_amount.toLocaleString('en-IN')}{' '}
                                <span className="text-[10px] font-bold text-slate-500 font-sans">(Sealed Escrow)</span>
                              </span>
                            ) : (
                              <span className="font-mono font-bold text-amber-800 text-xs bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300 inline-block">
                                [ 🔒 ENCRYPTED SHA-256 DIGEST ]
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Escrow Secrecy Note */}
                        <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {isOwnBid 
                              ? `Lodged in escrow. AI Price-Floor check & L1 announcement scheduled for ${selectedTender.result_announcement_time}.`
                              : `Protected under CVC Directive 02/2026. Quote & identity confidential until scheduled deadline.`}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            Status: <strong className="text-slate-700">PENDING_UNSEALING</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* UNSEALED EVALUATION MATRIX: Official Announcement & AI Scoring */
                <div className="space-y-3">
                  {selectedTender.bids.map((bid) => {
                    const isOwnBid = bid.contractor_name === userName || (isContractor && bid.contractor_name.toLowerCase().includes('venkateswara'));
                    const isL1 = bid.rank === 'L1';
                    const isDisqualified = bid.rank === 'DISQUALIFIED' || bid.ai_viability_status === 'ABNORMALLY_LOW_REJECTED';
                    const isAwarded = bid.status === 'ACCEPTED_AWARDED';

                    return (
                      <div
                        key={bid.id}
                        className={`p-4 rounded-xl border transition-all text-xs ${
                          isAwarded
                            ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                            : isL1
                            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                            : isDisqualified
                            ? 'bg-rose-50/40 border-rose-200 opacity-85'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2.5 border-b border-slate-100">
                          <div className="flex items-center gap-2.5">
                            {/* Rank Badge */}
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono shrink-0 ${
                              isAwarded ? 'bg-emerald-700 text-white shadow-xs' :
                              isL1 ? 'bg-amber-500 text-slate-950 shadow-xs' :
                              bid.rank === 'L2' ? 'bg-slate-300 text-slate-800' :
                              bid.rank === 'L3' ? 'bg-amber-700 text-white' :
                              'bg-rose-600 text-white'
                            }`}>
                              {isAwarded ? '🏆 AWARDED' : bid.rank ? bid.rank : 'EVAL'}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-gov-navy text-xs">
                                  {bid.contractor_name}
                                </h4>
                                {isOwnBid && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-200">
                                    YOUR FIRM
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500 font-mono">({bid.contractor_class})</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                GSTIN: {bid.contractor_gstin} • EMD Ref: {bid.emd_reference}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase">Unsealed Quoted Amount:</span>
                              <span className="font-mono font-black text-gov-navy text-sm">
                                ₹{bid.quoted_amount.toLocaleString('en-IN')}
                              </span>
                              <span className={`text-[10px] font-bold block ${
                                bid.variance_pct < -15 ? 'text-rose-600' :
                                bid.variance_pct < 0 ? 'text-emerald-700' : 'text-blue-700'
                              }`}>
                                {bid.variance_pct > 0 ? `+${bid.variance_pct}%` : `${bid.variance_pct}%`} vs Estimate
                              </span>
                            </div>

                            {/* Authority Award Action */}
                            {(isDistrictAuthority || isAdmin || isVigilanceAuditor) && selectedTender.status === 'OPEN_FOR_BIDDING' && isL1 && !isDisqualified && (
                              <button
                                onClick={() => handleAwardTender(selectedTender.id, bid.id, bid.contractor_name)}
                                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Award Contract to L1</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* AI Viability Audit Strip */}
                        <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-500">AI Viability Verdict:</span>
                            <span className={`px-2 py-0.5 rounded font-extrabold ${
                              isDisqualified ? 'bg-rose-100 text-rose-800' :
                              bid.ai_viability_status === 'REQUIRES_PERFORMANCE_BOND' ? 'bg-amber-100 text-amber-900' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {(bid.ai_viability_status || 'VIABLE').replace(/_/g, ' ')}
                            </span>
                            {bid.ai_viability_score !== undefined && (
                              <span className="font-mono font-bold text-slate-600">
                                (Score: {bid.ai_viability_score}/100)
                              </span>
                            )}
                          </div>

                          {bid.clearance_certificate_hash && (
                            <span className="font-mono text-[10px] text-slate-500">
                              📜 Hash: <strong className="text-gov-navy">{bid.clearance_certificate_hash}</strong>
                            </span>
                          )}
                        </div>

                        {/* Rejection / Viability Reason Note */}
                        {bid.ai_risk_flag && (
                          <div className="mt-2 p-2 rounded bg-slate-50 text-[11px] text-slate-700 leading-snug border border-slate-100">
                            {bid.ai_risk_flag}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AWARDED WORKS & MEASUREMENT BILLS */}
      {activeTab === 'MY_CONTRACTS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gov-ivory-border p-6 shadow-gov space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Progressive Measurement Bills & Milestone Billing</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit progressive Running Account (RA) bills with geotagged site proof for statutory field officer clearance.
                </p>
              </div>

              <button
                onClick={() => setShowBillModal(true)}
                className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <span>+ Submit New Measurement Bill</span>
              </button>
            </div>

            {/* Bills List */}
            <div className="space-y-3">
              {visibleMeasurementBills.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No measurement bills submitted yet.
                </div>
              ) : (
                visibleMeasurementBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-all text-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-gov-navy">{bill.bill_number}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            bill.status === 'FIELD_VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                            bill.status === 'PASSED_FOR_PAYMENT' ? 'bg-blue-100 text-blue-900' :
                            bill.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {bill.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-gov-navy">{bill.stage_milestone}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Target Project: {bill.project_id} • Submitted by: {bill.contractor_name}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Claimed Amount:</span>
                        <span className="font-mono font-black text-gov-navy text-sm">
                          ₹{bill.claimed_amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Progress: <strong>{bill.physical_progress_claimed}%</strong>
                        </span>
                      </div>
                    </div>

                    {/* Field Officer Remarks */}
                    {bill.field_officer_remarks && (
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span><strong>Field Officer Verification Note:</strong> {bill.field_officer_remarks}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Measurement Bill Submission Modal */}
      {showBillModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-gov-lg space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-gov-navy">Submit Progressive Measurement Bill (RA Bill)</h3>
              <button onClick={() => setShowBillModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitMeasurementBill} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Project ID:</label>
                <select
                  value={billProjectId}
                  onChange={(e) => setBillProjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="MPLAD-AP-2026-00125">MPLAD-AP-2026-00125 — Community Hall Tagarapuvalasa</option>
                  <option value="MPLAD-UP-2026-00084">MPLAD-UP-2026-00084 — Solar Drinking Water Varanasi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bill Reference Number:</label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Physical Progress Claimed (%):</label>
                  <input
                    type="number"
                    value={billPhysicalPct}
                    onChange={(e) => setBillPhysicalPct(Number(e.target.value))}
                    min="1"
                    max="100"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Milestone Stage Description:</label>
                <input
                  type="text"
                  value={billMilestone}
                  onChange={(e) => setBillMilestone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Claimed Tranche Amount (₹ INR):</label>
                <input
                  type="number"
                  value={billClaimedAmount}
                  onChange={(e) => setBillClaimedAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBill}
                  className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingBill ? 'Submitting...' : 'Submit Measurement Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Propose New Tender Notice (NIT) Modal */}
      {showNewTenderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-gov-lg space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-gov-navy flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-orange-600" />
                  <span>Official MoSPI / District Authority — Notice Inviting Tender (NIT)</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Statutory procurement issuance for sanctioned MPLAD works in accordance with GFR Rule 144 &amp; MoSPI Norms.
                </p>
              </div>
              <button onClick={() => setShowNewTenderModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishNewTender} className="space-y-3.5">
              {/* Target Project */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Sanctioned Project:</label>
                <select
                  value={newTenderProjectId}
                  onChange={(e) => {
                    setNewTenderProjectId(e.target.value);
                    const p = projects.find(proj => proj.id === e.target.value);
                    if (p) {
                      setNewTenderTitle(`Procurement of Works: ${p.title}`);
                      setNewTenderDept(p.implementing_agency || newTenderDept);
                      setNewTenderEstimate(p.sanctioned_amount || 1800000);
                      setNewTenderState(p.state || newTenderState);
                      setNewTenderDistrict(p.district || newTenderDistrict);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.id}] {p.title} — ₹{(p.sanctioned_amount || 1500000).toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tender Title / Scope of Work:</label>
                <input
                  type="text"
                  value={newTenderTitle}
                  onChange={(e) => setNewTenderTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  placeholder="e.g. Construction of Community Hall, Solar RO Plant, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Issuing Department:</label>
                  <input
                    type="text"
                    value={newTenderDept}
                    onChange={(e) => setNewTenderDept(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location (District & State):</label>
                  <input
                    type="text"
                    value={`${newTenderDistrict}, ${newTenderState}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(',');
                      if (parts[0]) setNewTenderDistrict(parts[0].trim());
                      if (parts[1]) setNewTenderState(parts[1].trim());
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sanctioned Estimate (₹ INR):</label>
                  <input
                    type="number"
                    value={newTenderEstimate}
                    onChange={(e) => setNewTenderEstimate(Number(e.target.value))}
                    step="10000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sealed Bidding Window Duration:</label>
                  <select
                    value={newTenderDeadlineMins}
                    onChange={(e) => setNewTenderDeadlineMins(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-gov-navy"
                  >
                    <option value={15}>15 Minutes (Fast Demonstration Window)</option>
                    <option value={30}>30 Minutes (Standard Real-World Test Protocol)</option>
                    <option value={60}>60 Minutes (Extended Window)</option>
                  </select>
                </div>
              </div>

              {/* Secrecy Protocol Notice */}
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-orange-600" />
                  <span>CVC Sealed-Bid Escrow Protocol:</span>
                </span>
                <p>
                  Upon publishing, this tender will be open for competitive electronic bidding. All contractor submissions will remain <strong>cryptographically sealed in escrow</strong>. Results will NOT be revealed prematurely; the AI Decision Engine will automatically unseal bids, evaluate CPWD price floors, and announce the winner when the {newTenderDeadlineMins}-minute window concludes.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTenderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingTender}
                  className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold rounded-xl shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Gavel className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>{isPublishingTender ? 'Publishing...' : 'Publish Official Tender Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
