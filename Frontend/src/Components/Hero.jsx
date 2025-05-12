import { Link } from 'react-router-dom';
import { ArrowUpRight, Code2, Users, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen text-center py-20">
          {/* Main content */}
          <div className="space-y-6 max-w-4xl">
            {/* Logo and title */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {/* <img
                src="./images/logo.png"
                className="h-16 w-20 md:h-20 md:w-24"
                alt="CodeUnity Logo"
              /> */}
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 font-heading">
                CollabCode
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-xl md:text-2xl font-medium italic text-blue-400 drop-shadow-lg">
              Empowering Collaboration, Unifying Code.
            </p>


            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
                <Code2 className="h-8 w-8 text-zinc-400 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Real-time Coding</h3>
                <p className="text-zinc-400 text-sm">Collaborate on code in real-time with your team</p>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
                <Users className="h-8 w-8 text-zinc-400 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Team Sync</h3>
                <p className="text-zinc-400 text-sm">Seamless communication and project coordination</p>
              </div>
              <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800">
                <Zap className="h-8 w-8 text-zinc-400 mb-4" />
                <h3 className="text-lg font-semibold text-zinc-200 mb-2">Saved workspaces</h3>
                <p className="text-zinc-400 text-sm">Access and view your old codes</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-zinc-400 max-w-3xl mx-auto">
              Experience coding like never before with our platform's real-time collaboration features.
              Easily join sessions, synchronize edits, chat, make calls, and boost productivity with
              seamless teamwork.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                to="/about"
                className="group relative px-8 py-4 w-full sm:w-auto rounded-lg bg-zinc-100 text-black font-medium hover:bg-zinc-200 transition-colors"
              >
                How to use
                <ArrowUpRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 w-full sm:w-auto rounded-lg bg-zinc-900 text-zinc-100 font-medium border border-zinc-800 hover:bg-zinc-800 transition-colors"
              >
                Explore
                <ArrowUpRight className="inline-block ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default Hero;
