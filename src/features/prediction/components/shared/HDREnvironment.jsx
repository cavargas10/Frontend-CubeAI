import { Environment } from "@react-three/drei";
import environmentHDR from '../../../../assets/venice_sunset_1k.hdr';

export function HDREnvironment() {
  return (
    <Environment
      files={environmentHDR}
      background={false}
      environmentIntensity={2.5} 
      environmentRotation={[0, Math.PI / 2, 0]} 
    />
  );
}