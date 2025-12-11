import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import "aframe";
import "ar.js";

interface Monument {
  id: string;
  title: string;
  description: string;
  location: string;
  era: string;
}

const ARViewer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const monumentId = searchParams.get("monument");
  const [monument, setMonument] = useState<Monument | null>(null);
  const [loading, setLoading] = useState(true);
  const [aframeReady, setAframeReady] = useState(false);

  // Fallback stories for demo when no monument ID
  const fallbackStories: Record<string, { title: string; story: string }> = {
    hampi: {
      title: "Hampi Ruins",
      story: "Once a thriving capital of the Vijayanagara Empire, Hampi witnessed grand festivals and royal ceremonies. Legend says the boulders were weapons thrown by monkey warriors in the Ramayana.",
    },
    meenakshi: {
      title: "Meenakshi Temple",
      story: "Built to honor Goddess Meenakshi, this temple is where the divine marriage of Shiva and Parvati took place. The towering gopurams are adorned with thousands of colorful deities.",
    },
    golconda: {
      title: "Golconda Fort",
      story: "Famous for its acoustic system, a clap at the entrance can be heard at the top. This fort was home to the legendary Koh-i-Noor diamond and withstood many sieges.",
    },
  };

  useEffect(() => {
    if (monumentId) {
      fetchMonument();
    } else {
      setLoading(false);
    }
  }, [monumentId]);

  useEffect(() => {
    const checkAFrame = setInterval(() => {
      if ((window as any).AFRAME) {
        setAframeReady(true);
        clearInterval(checkAFrame);
      }
    }, 100);
    
    return () => clearInterval(checkAFrame);
  }, []);

  const fetchMonument = async () => {
    try {
      const { data, error } = await supabase
        .from('monuments')
        .select('id, title, description, location, era')
        .eq('id', monumentId)
        .maybeSingle();

      if (error) throw error;
      setMonument(data);
    } catch (error) {
      console.error('Error fetching monument:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current monument info
  const getCurrentMonument = () => {
    if (monument) {
      return {
        title: monument.title,
        story: monument.description?.substring(0, 200) + "..." || "Explore this historic monument through AR.",
      };
    }
    // Check fallback
    const fallbackKey = monumentId?.toLowerCase();
    if (fallbackKey && fallbackStories[fallbackKey]) {
      return fallbackStories[fallbackKey];
    }
    return fallbackStories.hampi;
  };

  const currentMonument = getCurrentMonument();

  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-heritage-terracotta" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit AR
          </Button>
          <h1 className="text-white text-lg font-bold">{currentMonument.title}</h1>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-24 left-0 right-0 z-50 p-4">
        <div className="bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm max-w-md mx-auto">
          <h3 className="font-semibold mb-2">How to use AR:</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Download and print the Hiro marker below</li>
            <li>Allow camera access when prompted</li>
            <li>Point your camera at the marker</li>
            <li>Watch the story come to life!</li>
          </ol>
        </div>
      </div>

      {/* A-Frame AR Scene */}
      {aframeReady && (
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; precision: medium;"
        >
          {/* Camera */}
          <a-camera gps-camera rotation-reader></a-camera>

          {/* Marker-based AR */}
          <a-marker preset="hiro" raycaster="objects: .clickable" emitevents="true" cursor="fuse: false; rayOrigin: mouse;">
            {/* 3D Text Story */}
            <a-text
              value={currentMonument.story}
              color="#FFD700"
              align="center"
              width="4"
              position="0 1.5 0"
              wrap-count="35"
            ></a-text>

            {/* Monument Title */}
            <a-text
              value={currentMonument.title}
              color="#FFFFFF"
              align="center"
              width="3"
              position="0 2.2 0"
              font="mozillavr"
            ></a-text>

            {/* Decorative Elements */}
            <a-box
              position="0 0.3 0"
              rotation="0 45 0"
              scale="0.5 0.5 0.5"
              color="#C1502E"
              opacity="0.8"
              animation="property: rotation; to: 0 405 0; loop: true; dur: 8000"
            ></a-box>

            <a-torus
              position="0 0.8 0"
              color="#FFD700"
              radius="0.4"
              radius-tubular="0.03"
              animation="property: rotation; to: 360 0 360; loop: true; dur: 5000"
            ></a-torus>

            {/* Ambient particles */}
            <a-sphere
              position="0.8 1 0"
              radius="0.08"
              color="#4F7CAC"
              opacity="0.7"
              animation="property: position; to: -0.8 1 0; dir: alternate; dur: 3000; loop: true"
            ></a-sphere>
            <a-sphere
              position="-0.8 1 0"
              radius="0.08"
              color="#FFD700"
              opacity="0.7"
              animation="property: position; to: 0.8 1 0; dir: alternate; dur: 3000; loop: true"
            ></a-sphere>
          </a-marker>

          <a-entity camera></a-entity>
        </a-scene>
      )}

      {/* Marker Download */}
      <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center gap-4">
        <Button
          onClick={() => window.open("https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png", "_blank")}
          className="bg-heritage-terracotta hover:bg-heritage-terracotta/90 text-heritage-cream"
        >
          <Download className="mr-2 h-4 w-4" />
          Download AR Marker
        </Button>
      </div>
    </div>
  );
};

export default ARViewer;
