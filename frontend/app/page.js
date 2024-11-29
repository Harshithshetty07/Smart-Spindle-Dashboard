import TemperatureGauge from "@/components/Temperature";
import Image from "next/image";

export default function Home() {
  return (
   
<div>
<TemperatureGauge initialTemp={15} 
        minTemp={-20} 
        maxTemp={50}  />
</div>
  );
}
