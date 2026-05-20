# Bug #027: Network Timeout and Connection Errors

## What is it?

Network timeout and connection errors occur when communicating with remote systems without proper timeout handling, retry logic, or error recovery. These bugs cause applications to hang, lose data, or fail to handle temporary network issues gracefully.

## Why It Happens

1. **No Timeout Set**: Waiting indefinitely for response
2. **No Retry Logic**: Single failure immediately fails operation
3. **Poor Error Messages**: No visibility into network issues
4. **Connection Pool Issues**: Connections exhausted, not recycled
5. **Partial Data Handling**: Not handling incomplete responses
6. **DNS Resolution Failures**: Not catching lookup failures
7. **Protocol Mismatches**: Version incompatibilities
8. **Firewall/Proxy Issues**: Not handling intermediaries

## Symptoms

- Application hangs indefinitely
- Thread pool exhaustion
- Slow application response
- Intermittent failures
- Data loss in network failure
- Connection timeout errors
- "Connection refused" or "Connection reset"

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: No timeout set
fetch("https://api.example.com/data")
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error(e));
// Hangs forever if server doesn't respond!

// CORRECT: Use timeout with AbortController
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

fetch("https://api.example.com/data", {signal: controller.signal})
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => {
        if (e.name === 'AbortError') {
            console.error("Request timeout");
        } else {
            console.error(e);
        }
    })
    .finally(() => clearTimeout(timeout));

// WRONG: No retry on transient failure
async function fetchData() {
    return fetch("https://api.example.com/data")
        .then(r => r.json());
}
// Temporary network hiccup = complete failure

// CORRECT: Retry with backoff
async function fetchDataWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch("https://api.example.com/data");
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (i === maxRetries - 1) throw error;  // Last attempt
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));  // Exponential backoff
        }
    }
}
```

### Python
```python
# WRONG: No timeout
import socket
socket.setdefaulttimeout(None)  # No timeout!
response = urllib.request.urlopen("http://example.com")
# Can hang forever

# CORRECT: Set timeout
import urllib.request
try:
    response = urllib.request.urlopen("http://example.com", timeout=5)
except socket.timeout:
    print("Request timeout")

# WRONG: No error handling
import requests
response = requests.get("http://example.com")
data = response.json()  # What if request failed?

# CORRECT: Handle errors
import requests
try:
    response = requests.get("http://example.com", timeout=5)
    response.raise_for_status()  # Raise for non-200 status
    data = response.json()
except requests.Timeout:
    print("Request timeout")
except requests.ConnectionError:
    print("Connection error")
except requests.HTTPError as e:
    print(f"HTTP error: {e}")

# WRONG: No retry logic
import requests
def get_data():
    return requests.get("http://api.example.com/data").json()

# One temporary hiccup = failure

# CORRECT: Exponential backoff retry
import time
def get_data_with_retry(max_attempts=3):
    for attempt in range(max_attempts):
        try:
            response = requests.get("http://api.example.com/data", timeout=5)
            response.raise_for_status()
            return response.json()
        except (requests.Timeout, requests.ConnectionError) as e:
            if attempt == max_attempts - 1:
                raise
            wait_time = 2 ** attempt
            print(f"Retry in {wait_time}s after: {e}")
            time.sleep(wait_time)
```

### Java
```java
// WRONG: No timeout
URL url = new URL("http://example.com");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
InputStream is = conn.getInputStream();  // Can hang forever!

// CORRECT: Set timeout
URL url = new URL("http://example.com");
HttpURLConnection conn = (HttpURLConnection) url.openConnection();
conn.setConnectTimeout(5000);  // 5 seconds
conn.setReadTimeout(5000);
try {
    InputStream is = conn.getInputStream();
} catch (SocketTimeoutException e) {
    logger.error("Connection timeout", e);
} finally {
    conn.disconnect();
}

// WRONG: No retry on failure
public String fetchData(String url) throws IOException {
    HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
    try {
        return readResponse(conn);
    } finally {
        conn.disconnect();
    }
}
// Temporary network blip = failure

// CORRECT: Retry with backoff
public String fetchDataWithRetry(String url, int maxRetries) throws IOException {
    IOException lastException = null;
    for (int attempt = 0; attempt < maxRetries; attempt++) {
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            try {
                return readResponse(conn);
            } finally {
                conn.disconnect();
            }
        } catch (IOException e) {
            lastException = e;
            if (attempt < maxRetries - 1) {
                long waitTime = (long) Math.pow(2, attempt) * 1000;
                try {
                    Thread.sleep(waitTime);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new IOException("Interrupted", ie);
                }
            }
        }
    }
    throw lastException;
}

// WRONG: Connection pool not configured
CloseableHttpClient client = HttpClients.createDefault();
// Uses default pool, might exhaust connections under load

// CORRECT: Configure connection pool
PoolingHttpClientConnectionManager connManager = 
    new PoolingHttpClientConnectionManager();
connManager.setMaxTotal(100);
connManager.setDefaultMaxPerRoute(20);
CloseableHttpClient client = HttpClients.custom()
    .setConnectionManager(connManager)
    .build();
```

## How to Fix

1. **Set Timeouts**: Always specify connect and read timeouts
2. **Implement Retry Logic**: Exponential backoff for transient failures
3. **Handle Connection Errors**: Distinguish transient from permanent
4. **Use Connection Pools**: Manage and recycle connections
5. **Validate Responses**: Check status codes, content type
6. **Log Network Events**: For debugging network issues
7. **Circuit Breaker Pattern**: Stop retrying after repeated failures
8. **Health Checks**: Monitor connection health proactively

## Prevention Tips

- **Always set timeout**: Never rely on defaults
- **Test network failure**: Simulate network issues in tests
- **Monitor timeout metrics**: Track how often timeouts occur
- **Use retry libraries**: Don't implement retry manually
- **Circuit breaker pattern**: Prevent cascading failures
- **Connection pooling**: Use library management
- **Graceful degradation**: Fallback behavior on network failure
- **Load test**: See how app handles sustained network issues

## Timeout Best Practices

| Operation | Typical Timeout |
|-----------|-----------------|
| DNS lookup | 5-10 seconds |
| Connect | 5-10 seconds |
| Read | 10-30 seconds |
| Write | 10-30 seconds |

## Retry Strategy

| Error | Retry? | Backoff |
|-------|--------|---------|
| Timeout | Yes | Exponential |
| 5xx Server Error | Yes | Exponential |
| Connection Refused | Yes | Exponential |
| 4xx Client Error | No | N/A |
| 401 Unauthorized | No | N/A |

## Real-World Example

```python
# API call that can hang
def get_user_data(user_id):
    # BUG: No timeout, hangs if API is slow
    response = requests.get(f"http://api.example.com/users/{user_id}")
    return response.json()

# Leads to: thread pool exhaustion, application hangs

# FIXED: Timeout + retry + proper error handling
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def get_user_data_reliable(user_id):
    session = requests.Session()
    
    # Configure retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,  # 1s, 2s, 4s
        status_forcelist=[429, 500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    try:
        response = session.get(
            f"http://api.example.com/users/{user_id}",
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        logger.error(f"Timeout fetching user {user_id}")
        raise
    except requests.RequestException as e:
        logger.error(f"Failed to fetch user {user_id}: {e}")
        raise
```

## Related Bugs

- **Exception Handling** (#019): Network exception handling
- **Resource Cleanup** (#020): Closing connections properly
- **Thread Synchronization** (#025): Thread pool issues

## Key Takeaways

✅ Always set explicit timeouts  
✅ Implement exponential backoff retry  
✅ Distinguish transient from permanent failures  
✅ Use connection pools efficiently  
✅ Validate HTTP status codes  
✅ Monitor and log network issues  
✅ Test failure scenarios explicitly  
✅ Use circuit breaker pattern for cascading failures
