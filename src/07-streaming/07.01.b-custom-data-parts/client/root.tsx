import { useChat } from '@ai-sdk/react';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatInput, Message, Wrapper } from './compnents.tsx';
import './tailwind.css';
import type { MyUIMessage } from '../api/chat.ts';


const App = () => {
  const { messages, sendMessage } = useChat<MyUIMessage>({ });


  const [input, setInput] = useState(``);

  
  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      <ChatInput
        // NOTE: We are passing the suggestion to the ChatInput component
        // where we will display it as a butto
        input={input}
        onChange={(text) => setInput(text)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({
            text: input,
          });
          setInput('');
        }}
      />
    </Wrapper>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
