# 1.0.1

More sensible build defaults for use in environments where transpiling takes place:

- For ES Modules the src/index.js is directly referenced rather than a minified version
- Microbundle is configured to concatenate all files into one for the cjs builds, and minify a unpkg mjs file and umd js file for browser / non node usage

# 1.0.0

Initial Version
