
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Story, StoryNode } from '@/types';
import useLocalStorage from '@/hooks/use-local-storage';

interface StoryContextType {
  stories: Story[];
  addStory: (story: Story) => void;
  getStory: (id: string) => Story | undefined;
  updateStory: (id: string, updates: Partial<Story>) => void;
  addNodeToStory: (storyId: string, node: StoryNode) => void;
  setCurrentNode: (storyId: string, nodeId: string) => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [stories, setStories] = useLocalStorage<Story[]>('stories', []);

  const addStory = (story: Story) => {
    setStories(prevStories => [...prevStories, story]);
  };

  const getStory = (id: string) => {
    return stories.find(story => story.id === id);
  };
  
  const updateStory = (id: string, updates: Partial<Story>) => {
    setStories(prevStories =>
      prevStories.map(story =>
        story.id === id ? { ...story, ...updates } : story
      )
    );
  };

  const addNodeToStory = (storyId: string, node: StoryNode) => {
    setStories(prevStories =>
      prevStories.map(story => {
        if (story.id === storyId) {
          const newNodes = { ...story.nodes, [node.id]: node };
          return { ...story, nodes: newNodes, currentNodeId: node.id };
        }
        return story;
      })
    );
  };

  const setCurrentNode = (storyId: string, nodeId: string) => {
    setStories(prevStories =>
      prevStories.map(story =>
        story.id === storyId ? { ...story, currentNodeId: nodeId } : story
      )
    );
  }

  return (
    <StoryContext.Provider value={{ stories, addStory, getStory, updateStory, addNodeToStory, setCurrentNode }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStory = () => {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
};
