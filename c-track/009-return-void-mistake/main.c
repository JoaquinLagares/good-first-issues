#include <stdio.h>

// BUG: Function is declared as void but tries to return an int
void add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 5);
    printf("Result is %d\n", result);
    return 0;
}
