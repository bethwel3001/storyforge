"use client"
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { ArrowRight, BookCopy, PenSquare } from "lucide-react";
import {useEffect, useState} from "react";
import {useStory} from "@/lib/story-context";
import { motion } from "framer-motion";
const Library =()=>{
    const { stories } = useStory();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };
    return(
        <section className="w-full flex flex-col items-center justify-center mx-auto py-16 md:py-24 lg:py-32 bg-gray-800/20">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Your Story Library</h2>
                        {isClient && (
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                {stories.length > 0 ? "Continue your adventures or start a new one." : "Your created stories will appear here. Let's create your first!"}
                            </p>
                        )}
                    </div>
                </div>
                {isClient && stories.length > 0 ? (
                    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
                        {stories.slice(0, 3).map((story, i) => (
                            <motion.div
                                key={story.id}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="font-headline flex items-center gap-2">
                                            <BookCopy className="w-5 h-5 text-primary" />
                                            {story.title}
                                        </CardTitle>
                                        <CardDescription>Genre: {story.genre}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col justify-between">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {Object.keys(story.nodes).length} parts explored.
                                        </p>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto sm:px-4 md:w-full">
                                                <Link href={`/story/${story.id}`}>
                                                    Continue Story <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : isClient ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No stories yet. Time to create one!</p>
                        <Button asChild className="mt-4">
                            <Link href="/create">
                                <PenSquare className="mr-2 h-5 w-5" />
                                Start Your First Story
                            </Link>
                        </Button>
                    </div>
                ) : null}
            </div>
        </section>
    )
}
export default Library