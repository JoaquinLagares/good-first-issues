#include <stdio.h>

int main() {
    char name[5]; // Very small buffer
    
    printf("Enter your full name: ");
    // BUG: No limit on input size, easy to overflow name[5]
    scanf("%s", name);
    
    printf("Hello, %s\n", name);
    return 0;
}
