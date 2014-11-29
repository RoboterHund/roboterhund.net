roboterhund.net
===============

This is the source code of my personal website, [http://roboterhund.net](http://roboterhund.net "my domain+Linode server").  
I also have some private repositories, but I decided to make this one public so that I can easily show anyone a sample of my node.js code.  

Some files are missing from the repository:

- Private files that expose sensitive information, like API keys.
- Derived files, like CSS (from Sass).

This is still a work in progress.  
TODO list:

- Fix navigation bar (missing highlight of current section).
- Refactor code.
	- Reduce number of handler functions per route.
	- Make `appGlobal` more uniform.
- Improve CSS.
	- Refactor CSS.
	- Redesign TMDP section.
- Fix Google auth.
- Add multi-language support.

I'm also planning to update [https://www.npmjs.org/package/april1-html](https://www.npmjs.org/package/april1-html "April1-HTML npm package"), which is used here to render HTML.
