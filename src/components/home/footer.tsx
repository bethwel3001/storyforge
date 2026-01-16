import {Download} from "lucide-react";

const Footer =()=>{
    return(
        <footer className="w-full py-8 bg-secondary/50 mt-auto mx-auto flex flex-col items-center justify-center">
            <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} FlowTale+. All rights reserved.
                </p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                    <Download className="w-4 h-4" />
                    <p className="text-sm">Mobile apps coming soon!</p>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="text-muted-foreground hover:text-foreground">Twitter</a>
                    <a href="#" className="text-muted-foreground hover:text-foreground">Discord</a>
                </div>
            </div>
        </footer>
    )
}
export default Footer