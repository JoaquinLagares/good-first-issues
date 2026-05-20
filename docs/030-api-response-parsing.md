# Bug #030: API Response Parsing and Deserialization Errors

## What is it?

API response parsing errors occur when deserializing data from external APIs, leading to missing fields, type mismatches, null pointer exceptions, or silently ignoring errors. These bugs are common when APIs change or return unexpected formats.

## Why It Happens

1. **Unexpected API Response Format**: API changes or returns different schema
2. **Missing Field Handling**: Assuming required fields exist
3. **Type Mismatches**: JSON string vs expected number
4. **Null Values**: Not handling null responses
5. **Missing Error Checking**: HTTP 4xx/5xx not handled
6. **Version Mismatch**: Client expects old API format
7. **Partial Failures**: Some fields parse, others don't
8. **Encoding Issues**: Wrong charset for response

## Symptoms

- `NullPointerException` after API call
- `ClassCastException` during deserialization
- Application crashes on malformed response
- Data appears incomplete or missing
- Silent failures with no error message
- Works with API v1, breaks with v2
- Unicode/emoji in responses corrupted

## Examples in Multiple Languages

### JavaScript
```javascript
// WRONG: No error checking
fetch("/api/user")
    .then(r => r.json())
    .then(data => {
        console.log(data.name);  // What if response is error?
    });

// CORRECT: Check status code first
fetch("/api/user")
    .then(r => {
        if (!r.ok) {
            throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        }
        return r.json();
    })
    .then(data => {
        console.log(data.name);
    })
    .catch(error => {
        console.error("API error:", error);
    });

// WRONG: Assuming fields exist
.then(data => {
    console.log(data.user.profile.avatar.url);  // Chain of doom!
    // Crashes if any level is null/undefined
});

// CORRECT: Safe navigation
.then(data => {
    const avatarUrl = data?.user?.profile?.avatar?.url || "default.png";
    console.log(avatarUrl);
});

// WRONG: Type assumption
.then(data => {
    const quantity = data.quantity + 1;  // Might be string!
    // "5" + 1 = "51" (string concatenation!)
});

// CORRECT: Parse to expected type
.then(data => {
    const quantity = parseInt(data.quantity, 10) + 1;
    console.log(quantity);
});
```

### Python
```python
# WRONG: No error checking
import requests
response = requests.get("/api/user")
data = response.json()
print(data["name"])  # Crashes if error response

# CORRECT: Check status code
import requests
response = requests.get("/api/user")
response.raise_for_status()  # Raises HTTPError for 4xx/5xx
data = response.json()
print(data["name"])

# WRONG: Assuming fields exist
print(data["user"]["profile"]["avatar"]["url"])  # KeyError if missing!

# CORRECT: Use .get() with default
avatar_url = data.get("user", {}).get("profile", {}).get("avatar", {}).get("url", "default.png")
print(avatar_url)

# WRONG: Type mismatch not handled
count = data["count"] + 1  # Might be string!

# CORRECT: Validate type
count = int(data["count"]) + 1

# WRONG: Not handling empty response
response = requests.get("/api/user")
data = response.json()  # Could be None or empty!

# CORRECT: Validate non-empty
if not data:
    print("No data returned")
else:
    process(data)

# WRONG: Encoding issues
response = requests.get("/api/data")
# Default UTF-8, but what if API returns different encoding?

# CORRECT: Specify or detect encoding
response = requests.get("/api/data")
response.encoding = 'utf-8'  # Explicit
data = response.json()
```

### Java
```java
// WRONG: No error checking
HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
JsonObject data = JsonParser.parseString(response.body()).getAsJsonObject();
String name = data.get("name").getAsString();
// Crashes if status is error or JSON format wrong

// CORRECT: Check status and handle errors
HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
if (response.statusCode() < 200 || response.statusCode() >= 300) {
    throw new RuntimeException("HTTP " + response.statusCode());
}
JsonObject data = JsonParser.parseString(response.body()).getAsJsonObject();
String name = data.get("name").getAsString();

// WRONG: Assuming fields exist
String name = data.get("user").getAsJsonObject()
    .get("profile").getAsJsonObject()
    .get("name").getAsString();
// NullPointerException if any level missing!

// CORRECT: Check field existence
JsonObject user = data.has("user") ? 
    data.get("user").getAsJsonObject() : new JsonObject();
String name = user.has("name") ? 
    user.get("name").getAsString() : "Unknown";

// WRONG: Type mismatch
int count = data.get("count").getAsInt();  // Might be string!

// CORRECT: Handle type mismatch
int count;
try {
    count = data.get("count").getAsInt();
} catch (ClassCastException e) {
    count = Integer.parseInt(data.get("count").getAsString());
}

// Using POJO deserialization
class User {
    String name;
    int age;
}

// WRONG: No validation
User user = gson.fromJson(response.body(), User.class);
System.out.println(user.name);  // Might be null!

// CORRECT: Validate deserialized object
User user = gson.fromJson(response.body(), User.class);
if (user == null || user.name == null) {
    throw new RuntimeException("Invalid user data");
}
System.out.println(user.name);
```

## How to Fix

1. **Check HTTP Status**: Verify 2xx before parsing body
2. **Validate Field Existence**: Use `.has()`, `.get()`, null checks
3. **Type Validation**: Verify types before using
4. **Use Schema Validation**: JSON Schema for validation
5. **Handle Null Values**: Never assume values exist
6. **Versioning**: Support multiple API versions
7. **Logging**: Log raw responses for debugging
8. **Timeouts**: Set timeouts on HTTP requests

## Prevention Tips

- **Always check HTTP status**: 4xx/5xx aren't success
- **Never assume schema**: API can change
- **Validate at boundaries**: Parse external data carefully
- **Use type-safe parsers**: Typed deserialization when possible
- **Test with different responses**: Including error cases
- **Log API responses**: For debugging issues
- **Use API mocking**: Test with known responses
- **Version your API**: Support older clients

## Checklist for API Integration

```
✓ Check HTTP status code (not just 200)
✓ Handle non-200 error responses
✓ Check fields exist before accessing
✓ Validate data types
✓ Handle null/empty responses
✓ Set request timeout
✓ Handle network errors
✓ Retry with exponential backoff
✓ Log raw responses for debugging
✓ Test with malformed responses
```

## Real-World Example

```python
# Weather API integration bug
def get_temperature(city):
    # BUG: No error checking, assumes fields exist
    response = requests.get(f"https://api.weather.com/forecast?city={city}")
    data = response.json()
    temp = data["main"]["temp"]
    return temp

# Breaks when:
# - API returns 404 (city not found)
# - API returns 429 (rate limited)
# - API returns different structure
# - Network timeout
# Result: Application crashes

# FIXED: Proper error handling
def get_temperature(city):
    try:
        response = requests.get(
            f"https://api.weather.com/forecast?city={city}",
            timeout=5
        )
        response.raise_for_status()  # Raise for 4xx/5xx
        
        data = response.json()
        
        # Validate structure
        if not data.get("main", {}).get("temp"):
            logger.warning(f"No temperature data for {city}")
            return None
        
        return data["main"]["temp"]
        
    except requests.Timeout:
        logger.error("API request timeout")
        return None
    except requests.RequestException as e:
        logger.error(f"API request failed: {e}")
        return None
    except (KeyError, ValueError) as e:
        logger.error(f"Invalid API response: {e}")
        return None
```

## Related Bugs

- **Exception Handling** (#019): Error handling in parsing
- **Type Mismatch** (#003): Type confusion in deserialization
- **Null Safety** (#017): Null field handling

## Key Takeaways

✅ Always check HTTP status code  
✅ Validate field existence before access  
✅ Handle type mismatches gracefully  
✅ Never assume API response schema  
✅ Log raw responses for debugging  
✅ Test with error responses  
✅ Set timeouts on requests  
✅ Handle encoding explicitly
