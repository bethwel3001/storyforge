
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStory } from '@/lib/story-context';
import type { Story, StoryNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { continueStory } from '@/lib/actions';
import { Loader2, ArrowLeft, Share2, Download, Users, PlusCircle } from 'lucide-react';
import { StoryVisualizer } from '@/components/story-visualizer';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const { getStory, addNodeToStory, setCurrentNode } = useStory();
  const { toast } = useToast();
  
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [story, setStory] = useState<Story | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const storyFromContext = useMemo(() => isClient ? getStory(storyId) : undefined, [isClient, getStory, storyId]);

  useEffect(() => {
    if (storyFromContext) {
      setStory(storyFromContext);
    } else if (isClient) {
       // If story is not in context (e.g. page refresh), maybe redirect or show error
       router.push('/');
    }
  }, [storyFromContext, isClient, router]);

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
  
  const canEndStory = storyHistory.length >= 5;

  useEffect(() => {
    setSelectedChoice(null);
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [currentNode?.id]);

  if (!isClient || !story || !currentNode) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
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
      const existingNode = Object.values(story.nodes).find(
        (node) => node.parentId === currentNode.id && node.choice === choice
      );

      if (existingNode) {
        setCurrentNode(story.id, existingNode.id);
      } else {
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
            <Button variant="outline" disabled={!canEndStory}>
                <Download className="mr-2 h-4 w-4" />
                PDF
            </Button>
            <Button variant="outline" disabled={!canEndStory}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
            </Button>
            <Button asChild>
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Story
              </Link>
            </Button>
            <Button variant="destructive" disabled={!canEndStory}>End Story</Button>
        </div>
      </div>
      
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl">{story.title}</CardTitle>
            <CardDescription>Genre: {story.genre}</CardDescription>
            {story.characters && story.characters.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h4 className="font-headline text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Characters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                    {story.characters.map(char => (
                      <div key={char.name}>
                        <p className="font-bold text-base">{char.name}</p>
                        <p className="text-sm text-muted-foreground">{char.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardHeader>
          <CardContent className="p-0">
              <ScrollArea className="h-[50vh]" ref={scrollAreaRef}>
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
          {currentNode.branchingPaths.length > 0 && (
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <h3 className="font-bold text-lg font-headline">What do you do next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {currentNode.branchingPaths.map((choice, index) => {
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
                  })}
              </div>
            </CardFooter>
          )}
        </Card>
        
        <div className="space-y-4 pt-8">
            <h3 className="font-headline text-2xl">Your Narrative Map</h3>
            <p className="text-muted-foreground">Click a node to revisit that part of the story.</p>
            <div className="h-[60vh] w-full">
              <StoryVisualizer story={story} onNodeClick={handleNodeClick} />
            </div>
        </div>

      </div>
    </div>
  );
}
