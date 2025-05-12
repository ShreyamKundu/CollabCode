import { GitlabIcon as GitHub, Linkedin } from "lucide-react"
import { Link } from "react-router-dom"

const TeamMember = ({ name, role, image, github, linkedin }) => (
   <div className="group relative overflow-hidden rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 transition-all hover:bg-zinc-800/50 hover:border-zinc-700">
      <div className="aspect-square overflow-hidden">
         <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
         />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 transition-transform duration-300 group-hover:translate-y-0">
         <h3 className="text-2xl font-bold text-zinc-100 font-heading">{name}</h3>
         <p className="mt-1 text-sm text-zinc-400">{role}</p>
         <div className="mt-4 flex space-x-4">
            <Link to={github} className="text-zinc-400 hover:text-zinc-100 transition-colors">
               <GitHub size={20} />
            </Link>
            <Link to={linkedin} className="text-zinc-400 hover:text-zinc-100 transition-colors">
               <Linkedin size={20} />
            </Link>
         </div>
      </div>
   </div>
)

const Team = () => {
   const teamMembers = [
      {
         name: "Shreyam Kundu",
         role: "Full Stack Developer | MERN Developer",
         image: "/images/shrey.jpg",
         github: "https://github.com/ShreyamKundu",
         linkedin: "https://www.linkedin.com/in/shreyamkundu/",
      },
      {
         name: "Snikdhendu Pramanik",
         role: "Full Stack Developer | MERN Developer",
         image: "/images/snik.jpg",
         github: "https://github.com/snikdhendu",
         linkedin: "https://www.linkedin.com/in/snikdhendu-pramanik/",
      },
      {
         name: "Sounab Bhattacharjee",
         role: "Full Stack Developer | MERN Developer",
         image: "/images/sounab.jpg",
         github: "https://github.com/Sounabbhtchrzi",
         linkedin: "https://www.linkedin.com/in/sounab-bhattacharjee-aa3b3b266/",
      },
   ]

   return (
      <section className="relative bg-black overflow-hidden py-20">
         {/* Background gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

         {/* Grid pattern overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

         <div className="relative container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-zinc-100 mb-12 font-heading">
               Meet Our Team Members
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {teamMembers.map((member, index) => (
                  <TeamMember key={index} {...member} />
               ))}
            </div>
         </div>

         {/* Decorative elements */}
         <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
         <div className="absolute bottom-1/4 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </section>
   )
}

export default Team

