import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import React from 'react';
import ReactMarkdown from 'react-markdown';

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
  addToolApprovalResponse,
}: {
  role: string;
  parts: UIMessagePart<UIDataTypes, UITools>[];
  addToolApprovalResponse: (response: { id: string; approved: boolean }) => void;
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: ';

  const elements: (string | React.ReactNode)[] = [];
  let textBuffer = prefix;

  parts.forEach((part) => {
    if (part.type === 'tool-weather') {
      // Flush text buffer if it has content
      if (textBuffer.length > prefix.length) {
        elements.push(
          <ReactMarkdown key={`text-${elements.length}`}>
            {textBuffer}
          </ReactMarkdown>
        );
        textBuffer = '';
      }

      switch (part.state) {
        case 'approval-requested':
          elements.push(
            <div key={part.toolCallId}>
              <p>Get weather for {part?.input?.location}?</p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  onClick={() =>
                    addToolApprovalResponse({
                      id: part.approval.id,
                      approved: true,
                    })
                  }
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  onClick={() =>
                    addToolApprovalResponse({
                      id: part.approval.id,
                      approved: false,
                    })
                  }
                >
                  Deny
                </button>
              </div>
            </div>
          );
          break;
        case 'approval-responded':
          elements.push(
            <div key={part.toolCallId}>
              Weather in {part?.input?.location}: {part.output}
            </div>
          );
          break;
      }
    } else if (part.type === 'text') {
      textBuffer += part.text;
    }
  });

  // Flush remaining text
  if (textBuffer.length > prefix.length) {
    elements.push(
      <ReactMarkdown key={`text-${elements.length}`}>
        {textBuffer}
      </ReactMarkdown>
    );
  }

  return (
    <div className="prose prose-invert my-6">
      {elements}
    </div>
  );
};

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  disabled,
}: {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}) => (
  <form onSubmit={onSubmit}>
    <input
      className={`fixed bottom-0 w-full max-w-md p-2 mb-8 border-2 border-zinc-700 rounded shadow-xl bg-gray-800 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      value={input}
      placeholder={
        disabled
          ? 'Please handle tool calls first...'
          : 'Say something...'
      }
      onChange={onChange}
      disabled={disabled}
      autoFocus
    />
  </form>
);
