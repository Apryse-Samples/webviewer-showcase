"use client";

import React, { useEffect, useRef } from "react";
import JSONEditor, { JSONEditorOptions } from "jsoneditor";
import "jsoneditor/dist/jsoneditor.css";
import { Box } from "@chakra-ui/react";

interface JSONEditorComponentProps {
  jsonData: any;
  enabled: boolean;
}

const JSONEditorComponent: React.FC<JSONEditorComponentProps> = ({ jsonData, enabled }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const jsonEditorRef = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const options: JSONEditorOptions = {};
      
      options.mode =  'code',
      options.history = false;
      options.enableTransform  = false;
      options.enableSort = false;
      options.search = false;

      jsonEditorRef.current = new JSONEditor(containerRef.current, options);
    }

    return () => {
      if (jsonEditorRef.current) {
        jsonEditorRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    jsonEditorRef.current?.update(jsonData);
  },[jsonData])

  useEffect(() => {
    if(enabled){
      jsonEditorRef.current?.setMode('code');
    }else{
      jsonEditorRef.current?.setMode('view');
      jsonEditorRef.current?.expandAll();
    }
  },[enabled])

  return (
    <Box ref={containerRef} style={{width: '100%', height: "calc(100vh - 380px)"}}>
    </Box>
  );
};

export default JSONEditorComponent;