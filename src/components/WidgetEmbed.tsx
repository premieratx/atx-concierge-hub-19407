import React, { useRef, useEffect } from 'react';

interface WidgetEmbedProps {
  htmlContent: string;
  className?: string;
  title?: string;
}

export function WidgetEmbed({ htmlContent, className = '', title }: WidgetEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && htmlContent) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Create a temporary div to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      
      // Extract and execute scripts
      const scripts = tempDiv.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
          newScript.async = true;
        } else {
          newScript.textContent = script.textContent;
        }
        
        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        document.head.appendChild(newScript);
        
        // Remove the script from the HTML content to avoid duplication
        script.remove();
      });
      
      // Add the remaining HTML content
      containerRef.current.appendChild(tempDiv);
    }
  }, [htmlContent]);

  if (!htmlContent) {
    return (
      <div className={`p-8 text-center bg-muted/20 rounded-lg border-2 border-dashed border-muted ${className}`}>
        <p className="text-muted-foreground">No widget content provided</p>
        {title && <p className="text-sm text-muted-foreground mt-2">Widget: {title}</p>}
      </div>
    );
  }

  return (
    <div className={`widget-embed ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      )}
      <div 
        ref={containerRef}
        className="widget-content"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
}