#include <stdio.h>

int main() {
    int i = 10;
    
    // BUG: The loop condition i > 0 is always true because i increases
    while (i > 0) {
        printf("%d... ", i);
        i++; 
    }
    
    return 0;
}
