import React from "react";

const Footer: React.FC = React.memo(() => {
  return (
    <footer className="w-full border-t border-gray-300 bg-gray-100 py-4">
      <div className="flex justify-end px-12 font-helvetica text-sm text-gray-600">
        <span>
          by{" "}
          <a
            href="https://amoresjan.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline hover:text-gray-700"
          >
            @amoresjan
          </a>
        </span>
      </div>
    </footer>
  );
});

export default Footer;
