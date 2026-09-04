import pathlib

feature_exports = {
    'projects': 'export { PublicExplorer } from "../../pages/PublicExplorer";\nexport { ProjectDetailPage } from "../../pages/ProjectDetailPage";\nexport { useProjects, useProjectDetail } from "../../api/queries";\n',
    'funds': 'export { FundFlowPage } from "../../pages/FundFlowPage";\n',
    'contracts': 'export { ContractsPage } from "../../pages/ContractsPage";\n',
    'contractors': 'export { ContractorProfilePage } from "../../pages/ContractorProfilePage";\nexport { useContractors, useContractorDetail } from "../../api/queries";\n',
    'alerts': 'export { AlertsEscalationPage } from "../../pages/AlertsEscalationPage";\nexport { useAlerts, useResolveAlert } from "../../api/queries";\n',
    'inspections': 'export { FieldInspectionPage } from "../../pages/FieldInspectionPage";\nexport { useSubmitInspection } from "../../api/queries";\n',
    'complaints': 'export { CitizenComplaintPage } from "../../pages/CitizenComplaintPage";\nexport { useComplaints, useSubmitComplaint } from "../../api/queries";\n',
    'disputes': 'export { DisputesPage } from "../../pages/DisputesPage";\nexport { useDisputes } from "../../api/queries";\n',
    'guarantees': 'export { GuaranteesPage } from "../../pages/GuaranteesPage";\nexport { useGuarantees } from "../../api/queries";\n',
    'analytics': 'export { AIRiskCenterPage } from "../../pages/AIRiskCenterPage";\nexport { ReportsPage } from "../../pages/ReportsPage";\nexport { useAnalytics } from "../../api/queries";\n'
}

def main():
    for feat, content in feature_exports.items():
        p = pathlib.Path(f'frontend/src/features/{feat}/index.ts')
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding='utf-8')
        print(f"Generated feature slice: {p}")

if __name__ == '__main__':
    main()
