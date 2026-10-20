module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Templates use root-absolute paths (href="/css/...") which break on GitHub
  // Project Pages, served under /Personal-Port/ instead of the domain root.
  // Rewrite them at build time only when PATH_PREFIX is set (see deploy workflow).
  const pathPrefix = (process.env.PATH_PREFIX || "").replace(/\/$/, "");
  if (pathPrefix) {
    eleventyConfig.addTransform("path-prefix", (content, outputPath) => {
      if (outputPath && outputPath.endsWith(".html")) {
        return content.replace(/(href|src)="\/(?!\/)/g, `$1="${pathPrefix}/`);
      }
      return content;
    });
  }

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
