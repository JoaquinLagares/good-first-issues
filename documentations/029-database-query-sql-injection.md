# Bug #029: Database Query and SQL Injection

## What is it?

Database query bugs occur when SQL queries are constructed incorrectly, causing data loss, security vulnerabilities (SQL injection), or incorrect results. SQL injection is particularly dangerous, allowing attackers to execute arbitrary code on the database.

## Why It Happens

1. **String Concatenation**: Building queries by joining strings
2. **SQL Injection**: Unsanitized user input in queries
3. **Type Mismatches**: Wrong data types in queries
4. **Wrong Query Logic**: Incorrect WHERE or JOIN conditions
5. **N+1 Problem**: Executing query in loop causing performance issues
6. **No Parameter Binding**: Not using prepared statements
7. **Transaction Errors**: Not handling rollback properly

## Symptoms

- Unexpected data deleted/modified
- Security breach (SQL injection)
- Query returns wrong results
- Query extremely slow
- Database locked/unresponsive
- Data corruption
- Unauthorized access to data

## Examples in Multiple Languages

### Python
```python
# WRONG: String concatenation (SQL injection vulnerable!)
user_input = "'; DROP TABLE users; --"
query = "SELECT * FROM users WHERE name = '" + user_input + "'"
# Executes: SELECT * FROM users WHERE name = ''; DROP TABLE users; --'
# Table DELETED!

# CORRECT: Use parameterized queries
import sqlite3
conn = sqlite3.connect(":memory:")
cursor = conn.cursor()
user_input = "'; DROP TABLE users; --"
cursor.execute("SELECT * FROM users WHERE name = ?", (user_input,))
# Input is treated as literal string, not SQL

# WRONG: String formatting
query = f"SELECT * FROM products WHERE price > {user_price}"
# If user_price = "0 OR 1=1", returns ALL products!

# CORRECT: Parameterized with f-string (for display only)
query_safe = "SELECT * FROM products WHERE price > ?"
cursor.execute(query_safe, (user_price,))

# WRONG: N+1 problem
users = cursor.execute("SELECT id FROM users").fetchall()
for user_id in users:
    orders = cursor.execute(
        "SELECT * FROM orders WHERE user_id = ?", 
        (user_id,)
    )  # Query executed N times!

# CORRECT: Use JOIN
orders = cursor.execute("""
    SELECT orders.* FROM orders
    JOIN users ON orders.user_id = users.id
""")

# WRONG: No transaction handling
cursor.execute("INSERT INTO account SET balance = balance - 100")
cursor.execute("INSERT INTO bank SET balance = balance + 100")
# If second INSERT fails, first already committed!

# CORRECT: Use transaction
try:
    cursor.execute("BEGIN")
    cursor.execute("INSERT INTO account SET balance = balance - 100")
    cursor.execute("INSERT INTO bank SET balance = balance + 100")
    conn.commit()
except Exception as e:
    conn.rollback()
    raise e
```

### Java
```java
// WRONG: SQL injection (concatenation)
String username = userInput;  // Could be "' OR '1'='1"
String query = "SELECT * FROM users WHERE username = '" + username + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(query);
// Security vulnerability!

// CORRECT: Use prepared statement
String username = userInput;
String query = "SELECT * FROM users WHERE username = ?";
PreparedStatement pstmt = conn.prepareStatement(query);
pstmt.setString(1, username);
ResultSet rs = pstmt.executeQuery();
// Username treated as value, not SQL

// WRONG: Type confusion
String price = userInput;  // Could be non-numeric
String query = "SELECT * FROM products WHERE price > " + price;
// SQLException or incorrect behavior

// CORRECT: Parse and validate type
try {
    double price = Double.parseDouble(userInput);
    String query = "SELECT * FROM products WHERE price > ?";
    PreparedStatement pstmt = conn.prepareStatement(query);
    pstmt.setDouble(1, price);
    // ...
} catch (NumberFormatException e) {
    // Handle invalid input
}

// WRONG: N+1 queries
List<Order> orders = orderDao.getAllOrders();
for (Order order : orders) {
    User user = userDao.getUser(order.getUserId());  // Query per order!
    process(order, user);
}

// CORRECT: Batch query
String query = """
    SELECT orders.*, users.* 
    FROM orders 
    JOIN users ON orders.user_id = users.id
""";
List<OrderWithUser> results = executeQuery(query);
for (OrderWithUser row : results) {
    process(row.order, row.user);
}

// WRONG: No connection management
Connection conn = DriverManager.getConnection(url, user, pass);
// What if exception occurs? Connection never closed!

// CORRECT: Try-with-resources
try (Connection conn = DriverManager.getConnection(url, user, pass);
     PreparedStatement pstmt = conn.prepareStatement(query)) {
    pstmt.setString(1, username);
    ResultSet rs = pstmt.executeQuery();
}
```

### Node.js (JavaScript)
```javascript
// WRONG: String concatenation (SQL injection)
const userId = req.query.id;  // "1; DELETE FROM users; --"
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.query(query, (err, results) => {
    // VULNERABLE!
});

// CORRECT: Parameterized query
const userId = req.query.id;
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId], (err, results) => {
    // userId is value, not SQL code
});

// WRONG: Template literals (can be vulnerable)
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Still vulnerable!

// CORRECT: Proper parameterization
const query = "SELECT * FROM users WHERE email = ?";
db.query(query, [email], callback);
```

## How to Fix

1. **Use Prepared Statements**: Always use parameter binding
2. **Validate Input**: Check type and range before query
3. **Escape Output**: When displaying query results
4. **Principle of Least Privilege**: Database user only needs required permissions
5. **Use ORMs**: Many handle SQL injection prevention
6. **Limit Query Results**: Use LIMIT clause to prevent huge result sets
7. **Handle Transactions**: COMMIT/ROLLBACK for multi-step operations
8. **Monitor Queries**: Log slow or unusual queries

## Prevention Tips

- **Always use parameterized queries**: Never concatenate strings
- **Validate input**: Type, range, format checks
- **Use ORM if possible**: Reduces raw SQL exposure
- **Limit database permissions**: User shouldn't have DROP TABLE access
- **Test with malicious input**: "' OR '1'='1", "--", etc.
- **Code review**: SQL injection is serious
- **Enable query logging**: Monitor for injection attempts
- **Update drivers**: Security patches in database drivers

## SQL Injection Examples to Test

```sql
-- Always test your application with these inputs:
' OR '1'='1
'; DROP TABLE users; --
1 UNION SELECT password FROM admin
admin'--
1' AND '1'='1
```

## Real-World Example

```java
// Authentication bug
public boolean authenticateUser(String username, String password) {
    String query = "SELECT * FROM users WHERE username = '" + username + 
                   "' AND password = '" + password + "'";
    Statement stmt = conn.createStatement();
    ResultSet rs = stmt.executeQuery(query);
    return rs.next();  // Returns true if user found
}

// Attacker enters:
// username: " ' OR '1'='1"
// password: " ' OR '1'='1"

// Resulting query:
// SELECT * FROM users WHERE username = '' OR '1'='1' 
//   AND password = '' OR '1'='1'
// Returns FIRST user (usually admin!) - authentication bypassed!

// FIXED: Use prepared statement
public boolean authenticateUser(String username, String password) {
    String query = "SELECT * FROM users WHERE username = ? AND password = ?";
    PreparedStatement pstmt = conn.prepareStatement(query);
    pstmt.setString(1, username);
    pstmt.setString(2, password);
    ResultSet rs = pstmt.executeQuery();
    return rs.next();
}

// Now OR injection is treated as literal text, not SQL
```

## Related Bugs

- **Exception Handling** (#019): Database errors
- **Resource Cleanup** (#020): Closing connections
- **Type Mismatch** (#003): Type confusion in queries

## Key Takeaways

✅ Always use parameterized queries (prepared statements)  
✅ Never concatenate user input into SQL  
✅ Validate input types and ranges  
✅ Use ORM when possible  
✅ Database user needs minimal permissions  
✅ Test with malicious SQL injection payloads  
✅ Handle transactions properly (COMMIT/ROLLBACK)  
✅ Monitor query logs for suspicious activity
