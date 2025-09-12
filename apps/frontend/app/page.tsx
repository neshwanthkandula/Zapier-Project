import { Appbar } from "../components/appbar";
import  Hero  from "../components/hero"
import HeroVideo from "../components/HeroVideo";

export default function Home() {
  return (
    <div >
      <div className="flex justify-center">
        <Hero/>
      </div>
      <HeroVideo/>
    </div>
  );
}
