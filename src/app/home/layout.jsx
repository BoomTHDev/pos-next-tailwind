import Navbar from "./components/Navbar";

export default function HomeLayout({children}) {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto">{children}</div>
        </div>
    )
}