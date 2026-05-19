# BUG: File is opened but never closed
file = open("data.txt", "r")
content = file.read()
print(content)
# Missing file.close()

# If the program crashes or there's high load, the file may not be closed properly
