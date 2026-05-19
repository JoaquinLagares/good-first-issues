# DOM Bug #006: The Persistent Alert

### The Goal
Clicking "Stop Alerts" should prevent the "Alert Me" button from popping up messages.

### The Symptoms
Even after clicking "Stop Alerts", the first button still shows alerts.

### Hints
1. `removeEventListener` must take the EXACT same function reference that was used in `addEventListener`.
2. `() => showAlert()` creates a NEW anonymous function that doesn't match the original.
3. Pass the function name `showAlert` directly.
