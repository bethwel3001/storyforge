
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStory } from '@/lib/story-context';
import type { Story, StoryNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { continueStory } from '@/lib/actions';
import { Loader2, ArrowLeft, Share2, Download } from 'lucide-react';
import { StoryVisualizer } from '@/components/story-visualizer';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const { getStory, addNodeToStory, setCurrentNode } = useStory();
  const { toast } = useToast();
  
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // This is a workaround to get the latest story state from context
  const storyFromContext = getStory(storyId);
  useEffect(() => {
    if (storyFromContext) {
      setStory(storyFromContext);
    }
  }, [storyFromContext]);

  const storyHistory = useMemo(() => {
    if (!story) return [];
    const path: StoryNode[] = [];
    let currentNode = story.nodes[story.currentNodeId];
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = story.nodes[currentNode.parentId!];
    }
    return path;
  }, [story]);

  const currentNode = useMemo(() => {
    if (!story) return null;
    return story.nodes[story.currentNodeId];
  }, [story]);

  useEffect(() => {
    // Reset selected choice when the current node changes
    setSelectedChoice(null);
    // Scroll to bottom
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentNode?.id]);

  if (!story || !currentNode) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading story...
      </div>
    );
  }

  const handleChoice = async (choice: string) => {
    if (isLoading) return;
    setSelectedChoice(choice);
    setIsLoading(true);
    try {
      // Find which child node corresponds to the choice
      const nextNodeId = Object.values(story.nodes).find(
        (node) => node.parentId === currentNode.id && node.choice === choice
      )?.id;

      if (nextNodeId) {
        // If the node already exists, just navigate to it
        setCurrentNode(story.id, nextNodeId);
      } else {
        // Otherwise, generate the new story part
        const result = await continueStory(story, choice);
        const newNodeId = crypto.randomUUID();
        const newNode: StoryNode = {
          id: newNodeId,
          storyPart: result.newStoryPart,
          parentId: currentNode.id,
          choice: choice,
          branchingPaths: result.newBranchingPaths,
        };
        addNodeToStory(story.id, newNode);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An unexpected twist!',
        description: 'The story could not proceed. Please try another path.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setCurrentNode(story.id, nodeId);
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Button>
        <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                PDF
            </Button>
            <Button variant="outline" disabled>
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
            <Button variant="destructive" disabled>End Story</Button>
        </div>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{story.title}</h1>
        <p className="text-muted-foreground">Genre: {story.genre}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <Card className="shadow-lg h-[60vh] flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Journey</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-6">
                    {storyHistory.map((node, index) => (
                        <motion.div
                            key={node.id}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="mb-6"
                        >
                            {node.choice && (
                                <p className="text-muted-foreground italic mb-2 font-semibold">
                                    &gt; {node.choice}
                                </p>
                            )}
                            <p className="text-lg/relaxed whitespace-pre-wrap font-body">
                                {node.storyPart}
                            </p>
                        </motion.div>
                    ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <h3 className="font-bold text-lg font-headline">What do you do next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentNode.branchingPaths.length > 0 ? (
                  currentNode.branchingPaths.map((choice, index) => {
                    const isSelected = selectedChoice === choice;
                    return (
                      <motion.div key={index} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={() => handleChoice(choice)}
                          disabled={isLoading}
                          variant={isSelected ? 'default' : 'outline'}
                          className="text-left justify-start h-auto py-3 whitespace-normal w-full"
                        >
                          {isLoading && isSelected && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {choice}
                        </Button>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground">The path ends here... for now.</p>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2 lg:sticky top-20">
          <Card className="h-[60vh] w-full">
            <CardHeader>
              <CardTitle className="font-headline">Your Narrative Map</CardTitle>
              <CardDescription>Click a node to revisit that part of the story.</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)]">
              <StoryVisualizer story={story} onNodeClick={handleNodeClick} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
