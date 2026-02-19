import React from 'react';
import type { MyUIMessage } from '../api/chat.ts';

export const Wrapper = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {props.children}
    </div>
  );
};

export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: MyUIMessage['parts'];
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: ';

  const data_weather = parts
    .filter((part) => part.type === 'data-weather')
    .map((part, index) => (
      <div key={part.type + index} className="weather-widget">
        {part.data.status === 'loading' ? (
          <>Getting weather for {part.data.city}...</>
        ) : (
          <>
            Weather in {part.data.city}: {part.data.weather}
          </>
        )}
      </div>))


  const data_source = parts
    .filter((part) => part.type === 'source-url')
    .map((part, index) => (
      <div key={part.type + index}className="data-source-widget">
        {part.type}: {part.url}
      </div>))
    
  
      
  const text = parts
    .filter((part) => part.type === 'text')
    .map((part, index) => (
      <div key={part.type + index} className="data-text-widget">
        {part.text}
      </div>))
  
    
  const data = [...data_source, ...data_weather, ...text]

  console.log(data)

  
        return (
    <div className="prose prose-invert my-6">
      <h1>{prefix}</h1>
      {data}
    </div>
  );
};

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  suggestion,
}: {
  input: string;
  onChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  suggestion?: string | undefined;
}) => (
  <form
    onSubmit={onSubmit}
    className="fixed bottom-0 mb-8 max-w-md w-full"
  >
    <div className="flex flex-col gap-2 items-start">
      {suggestion && (
        <button
          type="button"
          className="text-xs text-gray-400 text-left bg-gray-800 px-3 py-1 rounded"
          onClick={() => {
            onChange(suggestion);
          }}
        >
          {suggestion}
        </button>
      )}
      <input
        className="w-full p-2 border-2 border-gray-700 rounded shadow-xl bg-gray-800"
        value={input}
        placeholder="Say something..."
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
    </div>
  </form>
);
