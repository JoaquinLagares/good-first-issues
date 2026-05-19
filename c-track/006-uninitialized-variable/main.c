#include <stdio.h>

int main() {
    int counter; // BUG: Not initialized to 0
    
    for(int i = 0; i < 5; i++) {
        counter++;
    }
    
    printf("Final count: %d\n", counter);
    return 0;
}
