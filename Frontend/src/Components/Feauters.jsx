import { Code2, Users, MessageSquare, Phone, Pen, Palette } from "lucide-react"

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 transition-all hover:bg-zinc-800/50 hover:border-zinc-700">
        <Icon className="h-8 w-8 text-blue-400 mb-4" />
        <h3 className="mb-2 text-xl font-bold text-zinc-100">{title}</h3>
        <p className="text-zinc-400">{description}</p>
    </div>
)

const About = () => {
    const features = [
        {
            icon: Code2,
            title: "Real-time Collaboration",
            description:
                "Collaboratively edit code in real-time with your teammates, with changes instantly reflected across all connected devices.",
        },
        {
            icon: Users,
            title: "Workspace Saving and Retrieval",
            description:
                "Save your workspace, including code files, chat history, and whiteboard sketches, and retrieve it later for seamless continuity.",
        },
        {
            icon: MessageSquare,
            title: "Chat Feature",
            description:
                "Engage in real-time text-based communication with your team members through the built-in chat feature, promoting collaboration and coordination.",
        },
        {
            icon: Phone,
            title: "Audio Calling",
            description:
                "Initiate audio calls within coding sessions for real-time voice communication, enhancing collaboration efficiency.",
        },
        {
            icon: Pen,
            title: "Whiteboard",
            description:
                "Utilize a virtual whiteboard to illustrate concepts, sketch out ideas, and brainstorm collaboratively, providing a visual aid for discussions.",
        },
        {
            icon: Palette,
            title: "Attractive UI",
            description:
                "Immerse yourself in a visually stunning user interface designed to captivate and inspire, enhancing your overall learning experience.",
        },
    ]

    return (
        <section className="relative bg-black overflow-hidden py-20">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            <div className="relative container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-100 font-heading">
                        Unlock the Ultimate Collaboration Experience
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Embark on a collaborative journey with our platform. Create rooms, join with a code, and code together in
                        real-time. Enjoy seamless chat and call features for enhanced collaboration.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </section>
    )
}

export default About

