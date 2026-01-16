import {
  About,
  Community,
  Footer,
  Hero,
  Library
} from "@/components/home";


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center mx-auto">
      <Hero/>
      <About/>
      <Library/>
      <Community/>
      <Footer/>
    </div>
  );
}
