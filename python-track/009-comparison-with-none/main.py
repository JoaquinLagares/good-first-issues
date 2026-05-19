value = None

# BUG: Using == instead of 'is' to check for None
if value == None:
    print("Value is None")
else:
    print("Value is not None")

# While the above works, it's not idiomatic Python
# The correct way is: if value is None:
