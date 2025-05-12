import { useState } from "react"
// import { Send } from "lucide-react"

export default function HelpSupport() {
    const [formData, setFormData] = useState({
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle form submission here
        console.log("Form submitted:", formData)
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100  p-16 pt-20  lg:ml-64 flex flex-wrap gap-20 justify-center items-center">
            <div className="max-w-md mx-auto min-w-[900px]">
                <h1 className="text-2xl font-semibold text-primary mb-6">Contact Support</h1>

                <form onSubmit={handleSubmit} className="space-y-4  ">
                    <div>
                        <label htmlFor="email" className="block text-sm mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-teal-400 focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-sm mb-2">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            required
                            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-teal-400 focus:outline-none"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 focus:border-teal-400 focus:outline-none resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white p-2 rounded-lg transition-colors"
                    >
                        Send Message
                        {/* <Send className="w-4 h-4" /> */}
                    </button>
                </form>
            </div>
        </div>
    )
}