import { DPTHeader } from './dpt-components/dpt-header';
import { DPTIntroduction } from './dpt-components/dpt-introduction';
import { DPTDiseaseProtection } from './dpt-components/dpt-disease-protection';
import { DPTImportance } from './dpt-components/dpt-importance';
import { DPTConsequences } from './dpt-components/dpt-consequences';
import { DPTSchedule } from './dpt-components/dpt-schedule';

export default function DPTVaccineInfo() {
  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <DPTHeader />
      <DPTIntroduction />
      <DPTDiseaseProtection />
      <DPTImportance />
      <DPTConsequences />
      <DPTSchedule />
    </div>
  );
}