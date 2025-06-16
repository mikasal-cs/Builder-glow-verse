import React, { useEffect, useState } from "react";
import { BuilderComponent } from "@builder.io/react";
import { Builder } from "../../builder.init";

interface BuilderContentProps {
  model?: string;
  url?: string;
  content?: any;
}

export function BuilderContent({
  model = "page",
  url = "/",
  content: initialContent,
}: BuilderContentProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(!initialContent);

  // Check if we're in Builder.io preview mode
  const isPreviewing =
    typeof window !== "undefined" &&
    (window.location.search.includes("builder.preview=") ||
      window.location.pathname.includes("/builder/"));

  useEffect(() => {
    if (!initialContent) {
      setLoading(true);
      Builder.get(model, {
        url,
        prerender: false,
      })
        .promise()
        .then((content) => {
          setContent(content);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Builder.io content fetch error:", error);
          setLoading(false);
        });
    }
  }, [model, url, initialContent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="loading-shimmer w-full h-32 rounded-lg"></div>
      </div>
    );
  }

  if (!content && !isPreviewing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-lg font-semibold mb-2">No content found</h2>
        <p className="text-muted-foreground">
          This page doesn't have any Builder.io content yet.
        </p>
      </div>
    );
  }

  return <BuilderComponent model={model} content={content} />;
}
