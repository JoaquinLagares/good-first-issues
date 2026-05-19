#include <stdio.h>
#include <string.h>

int main() {
    char password[] = "secret";
    char input[20];
    
    printf("Enter password: ");
    scanf("%s", input);
    
    // BUG: You cannot compare strings using == in C
    if (input == password) {
        printf("Access Granted!\n");
    } else {
        printf("Access Denied!\n");
    }
    
    return 0;
}
