import copy from "copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const Code = ({ content }: { content: string }) => {
  return (
    <div className="relative">
      <button
        aria-label="copy-to-clipboard"
        className="absolute top-2 right-2 rounded-md bg-gray-500 p-1.5 hover:cursor-pointer hover:bg-gray-400"
        onClick={() => copy(content)}
      >
        <FiCopy />
      </button>
      <SyntaxHighlighter language="yaml" showLineNumbers style={dracula}>
        {content}
      </SyntaxHighlighter>
    </div>
  );
};
