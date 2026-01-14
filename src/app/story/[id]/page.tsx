"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStory } from '@/lib/story-context';
import type { Story, StoryNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { continueStory } from '@/lib/actions';
import { Loader2, ArrowLeft } from 'lucide-react';
import { StoryVisualizer } from '@/components/story-visualizer';
import { AnimatePresence, motion } from 'framer-motion';

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const { getStory, addNodeToStory, setCurrentNode } = useStory();
  const { toast } = useToast();
  
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;

  // This is a workaround to get the latest story state from context
  const storyFromContext = getStory(storyId);
  useEffect(() => {
    if (storyFromContext) {
      setStory(storyFromContext);
    }
  }, [storyFromContext]);


  const currentNode = useMemo(() => {
    if (!story) return null;
    return story.nodes[story.currentNodeId];
  }, [story]);

  if (!story || !currentNode) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading story...
      </div>
    );
  }

  const handleChoice = async (choice: string) => {
    setIsLoading(true);
    try {
      const result = await continueStory(story, choice);
      const newNodeId = crypto.randomUUID();
      const newNode: StoryNode = {
        id: newNodeId,
        storyPart: result.newStoryPart,
        parentId: currentNode.id,
        choice: choice,
        branchingPaths: result.newBranchingPaths,
      };
      
      addNodeToStory(story.id, newNode, choice, currentNode.id);

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
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Library
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold mb-2">{story.title}</h1>
        <p className="text-muted-foreground">Genre: {story.genre}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
              <motion.div
                  key={currentNode.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
              >
                  <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Your Journey Continues...</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-lg/relaxed whitespace-pre-wrap font-body">{currentNode.storyPart}</p>
                  </CardContent>
                  <CardFooter className="flex-col items-start gap-4">
                      <h3 className="font-bold text-lg font-headline">What do you do next?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {currentNode.branchingPaths.length > 0 ? currentNode.branchingPaths.map((choice, index) => (
                          <Button
                          key={index}
                          onClick={() => handleChoice(choice)}
                          disabled={isLoading}
                          variant="outline"
                          className="text-left justify-start h-auto py-3"
                          >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {choice}
                          </Button>
                      )) : (
                          <p className="text-muted-foreground">The path ends here... for now.</p>
                      )}
                      </div>
                  </CardFooter>
                  </Card>
              </motion.div>
          </AnimatePresence>
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