#include <iostream>

class Animal {
public:
    virtual void speak() {
        std::cout << "Animal speaks" << std::endl;
    }
    
    // BUG: Missing virtual destructor
    ~Animal() {
        std::cout << "Destroying Animal" << std::endl;
    }
};

class Dog : public Animal {
public:
    void speak() override {
        std::cout << "Woof!" << std::endl;
    }
    
    ~Dog() {
        std::cout << "Destroying Dog" << std::endl;
    }
};

int main() {
    Animal* pet = new Dog();
    pet->speak();
    delete pet; // Only calls Animal destructor, not Dog's!
    return 0;
}
