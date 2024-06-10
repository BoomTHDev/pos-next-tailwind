import Navbar from "./components/Navbar";

export default function HomeLayout({children}) {
    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="container mx-auto">{children}</div>
        </div>
    )
}