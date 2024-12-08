// app/page.js
import OpeningSection from './components/sections/OpeningSection';
import ParadoxSection from './components/sections/ParadoxSection';
import DanceabilityCorrelationSection from './components/sections/DanceabilityCorrelation';
import ChartPerformanceSection from './components/sections/ChartPerformanceSection';
import DeepDiveSection from './components/sections/DeepDiveSection';
import InvestigationSection from './components/sections/InvestigationSection';
import ConclusionSection from './components/sections/ConclusionSection';

export default function Home() {
  return (
    <main className="relative">
      <OpeningSection />
      <DanceabilityCorrelationSection />
      <ChartPerformanceSection />
      <DeepDiveSection />
      <InvestigationSection />
      <ConclusionSection />
    </main>
  );
}