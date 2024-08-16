"use client";

import { scrapAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonLink = (url: string): Boolean => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith("amazon")) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");

    const isValidLink = isValidAmazonLink(searchPrompt);
    if (!isValidLink) return alert("Please provide a valid Amazon product link");

    try {
      setIsLoading(true);
      const product = await scrapAndStoreProduct(searchPrompt);
      console.log(product);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter Product Link"
        className="searchbar-input"
      />
      <button type="submit" className="searchbar-btn" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
