import Aurora from "./Aurora";


export function AuroraBackground({ children }) {
  return (
    <>
      {/* Background Particles */}
      <div className="absolute  w-[99.5%] h-full z-[-10] bg-black	">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
                />
      </div>

      {/* Foreground Content */}
      <div className="flex justify-center  w-[99.5%] h-full">
        {children}
      </div>
    </>
  );
}
