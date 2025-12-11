import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, BookOpen, Eye, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sampleStory = {
  short: `According to local legend, two brothers hunting in the forest witnessed a miraculous sight: a hare chasing a hound. Taking this as a divine sign of the land's power, they founded the magnificent Vijayanagara Empire at this very spot in 1336 CE.`,
  medium: `The story begins with two brothers, Harihara and Bukka, who were sent by their master to hunt in the dense forests of Karnataka. During their expedition, they witnessed an extraordinary event that would change the course of history. A hare, typically prey, was chasing a hound - a complete reversal of nature's order.

Interpreting this as a divine message about the land's unique power, they consulted their spiritual guru, Vidyaranya. The sage confirmed that this was indeed a sacred sign, and advised them to establish their capital at this blessed location. Thus began the great Vijayanagara Empire in 1336 CE.`,
  detailed: `In the early 14th century, two brothers named Harihara and Bukka served under the Hoysala kingdom. When their master dispatched them on a hunting expedition to the wilderness of what is now Karnataka, they could not have imagined they would witness a miracle that would lead to the founding of one of India's greatest empires.

Deep in the forest, the brothers observed an astonishing phenomenon: a small hare was boldly chasing a powerful hunting hound through the undergrowth. This complete reversal of the natural order - where the prey pursued the predator - left them spellbound. In the spiritual traditions of India, such unusual natural occurrences were considered messages from the divine.

The brothers immediately sought the counsel of their revered guru, Sage Vidyaranya, a learned scholar and spiritual guide. After deep meditation and consultation of ancient texts, Vidyaranya proclaimed that the land possessed extraordinary spiritual energy. He advised them that founding a city at this location would result in a kingdom of unparalleled prosperity and power.

Following this divine guidance, Harihara and Bukka established Vijayanagara, the "City of Victory," in 1336 CE. The empire would go on to become one of the most prosperous in Indian history, controlling vast territories across South India for over two centuries.`
};

export const StoryPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('short');

  const handleAudio = async (language: string) => {
    setAudioLoading(true);
    try {
      const text = sampleStory[currentTab as keyof typeof sampleStory];
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, language }
      });

      if (error) throw error;

      toast({
        title: "Narration Generated",
        description: `${language === 'en' ? 'English' : 'Kannada'} narration: "${data.text.substring(0, 100)}..."`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate audio",
        variant: "destructive",
      });
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI-Powered Story Experience
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your preferred length and language for each folk story
            </p>
          </div>

          <Card className="p-8 border-0 shadow-monument bg-gradient-card">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">
                  The Legend of Vijayanagara
                </h3>
                <Badge className="bg-heritage-indigo text-heritage-cream">
                  Hampi Ruins
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-heritage-gold text-heritage-terracotta">
                  Mythology
                </Badge>
                <Badge variant="outline" className="border-heritage-gold text-heritage-terracotta">
                  14th Century
                </Badge>
                <Badge variant="outline" className="border-heritage-gold text-heritage-terracotta">
                  Karnataka
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="short" className="w-full" onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="short">Short (2 min)</TabsTrigger>
                <TabsTrigger value="medium">Medium (5 min)</TabsTrigger>
                <TabsTrigger value="detailed">Detailed (10 min)</TabsTrigger>
              </TabsList>

              <TabsContent value="short" className="space-y-4">
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="leading-relaxed">{sampleStory.short}</p>
                </div>
              </TabsContent>

              <TabsContent value="medium" className="space-y-4">
                <div className="prose prose-lg max-w-none text-foreground whitespace-pre-line">
                  <p className="leading-relaxed">{sampleStory.medium}</p>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-4">
                <div className="prose prose-lg max-w-none text-foreground whitespace-pre-line">
                  <p className="leading-relaxed">{sampleStory.detailed}</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-border">
              <Button 
                onClick={() => handleAudio('en')}
                disabled={audioLoading}
                className="bg-heritage-terracotta hover:bg-heritage-terracotta/90 text-heritage-cream"
              >
                {audioLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Volume2 className="mr-2 h-4 w-4" />}
                Listen in English
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAudio('kn')}
                disabled={audioLoading}
                className="border-heritage-indigo text-heritage-indigo hover:bg-heritage-indigo/10"
              >
                {audioLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Volume2 className="mr-2 h-4 w-4" />}
                ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/ar?monument=hampi')}
                className="border-heritage-gold text-heritage-earth hover:bg-heritage-gold/10"
              >
                <Eye className="mr-2 h-4 w-4" />
                View in AR
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  const el = document.getElementById('monuments');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-heritage-terracotta text-heritage-terracotta hover:bg-heritage-terracotta/10"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Read More Stories
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
