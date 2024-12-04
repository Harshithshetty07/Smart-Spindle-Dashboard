import Dashboard from "@/components/Dashboard";
import Slider from '@/components/Slider';
import TemperatureGauge from "@/components/Temperature";
import Image from "next/image";

export default function Home() {
  return (
   
<div>
  <Dashboard />
    <Slider />
    <TemperatureGauge />
</div>
  );
}
