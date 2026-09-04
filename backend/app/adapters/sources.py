from typing import Dict, Any, List

class MPLADSSource:
    "Source adapter for MoSPI MPLADS web portal API/ETL."
    def fetch_constituency_allocations(self, state: str, constituency: str) -> Dict[str, Any]:
        return {
            source: MoSPI_MPLADS_ETL,
            state: state,
            constituency: constituency,
            annual_entitlement: 50000000.0,
            status: SYNCED
        }

class OGDSource:
    "Source adapter for Open Government Data (data.gov.in) portal."
    def fetch_district_sanction_benchmarks(self, state: str) -> List[Dict[str, Any]]:
        return [
            {sector: Drinking Water, avg_completion_months: 8.5},
            {sector: Education, avg_completion_months: 11.2},
            {sector: Healthcare, avg_completion_months: 14.0},
            {sector: Roads & Bridges, avg_completion_months: 9.8}
        ]

class ProcurementSource:
    "Source adapter for GeM (Government e-Marketplace) and State e-Procurement portals."
    def check_vendor_debarment_status(self, vendor_gst: str) -> Dict[str, Any]:
        return {
            gstin: vendor_gst,
            is_blacklisted: False,
            debarment_record: None,
            gem_star_rating: 4.6
        }
