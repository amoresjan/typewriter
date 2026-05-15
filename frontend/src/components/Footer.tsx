import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-ash-border bg-ghost py-2">
      <div className="flex justify-end px-12 font-sans text-sm text-attribution">
        <span>
          by{" "}
          <a
            href="https://amoresjan.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline hover:opacity-70"
          >
            @amoresjan
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
