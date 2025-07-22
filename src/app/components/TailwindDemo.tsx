export default function TailwindDemo() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full object-cover md:h-full md:w-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">Tailwind CSS</span>
          </div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Working!</div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
            Next.js + Tailwind CSS Setup Complete
          </h2>
          <p className="mt-2 text-slate-500">
            This component demonstrates that Tailwind CSS is properly configured with your Next.js application.
            You can see responsive design, colors, typography, and layout utilities all working together.
          </p>
          <div className="mt-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Click me!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 