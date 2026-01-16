"use client"
import {Button} from "@/components/ui/button";
import {BookCopy, BotMessageSquare, GitMerge, Star, Users} from "lucide-react";

import {useEffect, useState} from "react";
import {useStory} from "@/lib/story-context";

const Community =()=>{
    const [isClient, setIsClient] = useState(false);
    const { stories } = useStory();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const communityStats = [
        { name: "Stories Created", value: isClient ? stories.length : 0, icon: BookCopy },
        { name: "Community Stars", value: "1.2k", icon: Star },
        { name: "Active Contributors", value: "24", icon: Users },
        { name: "AI Invocations", value: "10k+", icon: BotMessageSquare },
    ];
    return(
        <section className="w-full flex flex-col justify-center items-center mx-auto py-16 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Join the Community</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                            This project is open-source and built with the help of creators like you.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 py-12 sm:grid-cols-4">
                    {communityStats.map((stat) => (
                        <div key={stat.name} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-secondary/50">
                            <stat.icon className="w-8 h-8 text-primary" />
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-sm text-muted-foreground text-center">{stat.name}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Button asChild size="lg">
                        <a href="https://github.com/bethwel3001/flowtale" target="_blank" rel="noopener noreferrer">
                            <GitMerge className="mr-2 h-5 w-5" />
                            Contribute on GitHub
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
export default Community