# Bug #010: The Vulnerable Tab

### The Goal
Open the link in a new tab securely.

### The Symptoms
Standard linting tools would flag this link as a security risk because `target="_blank"` allows the new page some access to your page.

### Hints
1. When using `target="_blank"`, you should also include a `rel` attribute.
2. The recommended value is `rel="noopener"`. 
