"use client";

import {useTransition} from "react";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { startStory } from "@/lib/actions";
import { useStory } from "@/lib/story-context";
import { Loader2, PenSquare } from "lucide-react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import GENRE_PARTS from "@/constants/genres";


const formSchema = z.object({
  topic: z.string().min(10, {
    message: "Topic must be at least 10 characters.",
  }).max(200, {
    message: "Topic must not exceed 200 characters.",
  }),
  tone: z.string().min(3, {
    message: "Tone should not be empty.",
  }),
  core:z.string().min(3, {
    message: "Core should not be empty.",
  }),
  modifier:z.string().min(3, {
    message: "modifier should not be empty.",
  }),
  theme:z.string().min(3, {
    message: "Theme should not be empty.",
  }),


});

// generate a story with this format
// Tone  modifier core  of  theme
// "Bleak Cosmic Horror of Identity"
const generateGenre =(tone:string,modifier:string,core:string,theme:string)=>{
  return `${tone} ${modifier} ${core} of ${theme} story`;
}

export default function CreateStoryPage() {
  const router = useRouter();
  const { addStory } = useStory();
  const { toast } = useToast();
  const[isPending,startTransition] =useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone:"",
      modifier:"",
      core:"",
      theme:""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async ()=>{
      try {

        const genre =generateGenre(values.tone,values.modifier,values.core,values.theme)
        console.log(genre)
        const newStoryData = await startStory(values.topic, genre);
        const storyId = crypto.randomUUID();
        const newStory = { ...newStoryData, id: storyId };

        addStory(newStory);
        toast({
          title: "Story Created!",
          description: "Your new adventure awaits.",
        });

        router.push(`/story/${storyId}`);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: "There was a problem creating your story. Please try again.",
        });

      }
    })

  }


  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl md:text-4xl">
              Create a New Narrative
            </CardTitle>
            <CardDescription>
              Provide a topic and genre to kickstart your AI-powered story. What adventure will you begin?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Topic</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., A lone astronaut discovers a mysterious signal from an uncharted planet."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />

                      </FormControl>
                      <FormDescription>
                        This is the starting prompt for your story.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className={"flex flex-wrap w-full items-center gap-2"}>
                  <FormField
                      control={form.control}
                      rules={{ required: true }}
                      name={"tone"}
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {GENRE_PARTS.tone.map((tone,index)=>(
                                      <SelectItem value={tone} key={index}>{tone}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      rules={{ required: true }}
                      name={"core"}
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Story Genre</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select a core" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {GENRE_PARTS.core.map((genre,index)=>(
                                      <SelectItem value={genre} key={index}>{genre}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      rules={{ required: true }}
                      name={"modifier"}
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Story Modifier</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select a modifier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {GENRE_PARTS.modifier.map((modifier,index)=>(
                                      <SelectItem value={modifier} key={index}>{modifier}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      rules={{ required: true }}
                      name={"theme"}
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectGroup>
                                  {GENRE_PARTS.theme.map((theme,index)=>(
                                      <SelectItem value={theme} key={index}>{theme}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                </div>
                <div className="flex justify-center pt-4">
                  <Button type="submit" disabled={isPending} size="lg">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conjuring...
                      </>
                    ) : (
                      <>
                        <PenSquare className="mr-2 h-4 w-4" />
                        Begin Adventure
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
