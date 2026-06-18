#include <iostream>
#include <string>
#include <vector>
#include <stdexcept>
#include <stack>
#include <cmath>
#include <cctype>

// Strongly typed enum for professional-grade token classification
enum class TokenType {
    Number,
    Operator,
    LeftParen,
    RightParen
};

// Encapsulates token classification and string value
struct Token {
    TokenType type;
    std::string value;
};

// Assigns integer-priority hierarchies for operators
int precedence(const std::string& op) {
    if (op == "+" || op == "-") return 1;
    if (op == "*" || op == "/") return 2;
    if (op == "^") return 3;
    return 0;
}

// Dictates right-to-left evaluation pathways (applicable to ^)
bool isRightAssociative(const std::string& op) {
    return op == "^"; 
}

// --- PHASE 1: Tokenizer ---
std::vector<Token> tokenize(const std::string& expression) {
    std::vector<Token> tokens;
    for (size_t i = 0; i < expression.length(); ++i) {
        char c = expression[i];
        if (std::isspace(c)) continue; // Ignore whitespace

        if (std::isdigit(c) || c == '.') {
            std::string numStr;
            while (i < expression.length() && (std::isdigit(expression[i]) || expression[i] == '.')) {
                numStr += expression[i++];
            }
            --i; // Step back one character
            tokens.push_back({TokenType::Number, numStr});
        } else if (c == '+' || c == '-' || c == '*' || c == '/' || c == '^') {
            tokens.push_back({TokenType::Operator, std::string(1, c)});
        } else if (c == '(') {
            tokens.push_back({TokenType::LeftParen, "("});
        } else if (c == ')') {
            tokens.push_back({TokenType::RightParen, ")"});
        } else {
            throw std::runtime_error(std::string("Invalid character encountered: ") + c);
        }
    }
    return tokens;
}

// --- PHASE 2: Shunting Yard Algorithm ---
std::vector<Token> infixToPostfix(const std::string& expression) {
    std::vector<Token> tokens = tokenize(expression);
    std::vector<Token> outputQueue;
    std::stack<Token> operatorStack;

    for (const auto& token : tokens) {
        if (token.type == TokenType::Number) {
            outputQueue.push_back(token);
        } else if (token.type == TokenType::LeftParen) {
            operatorStack.push(token);
        } else if (token.type == TokenType::RightParen) {
            bool match = false;
            while (!operatorStack.empty()) {
                if (operatorStack.top().type == TokenType::LeftParen) {
                    operatorStack.pop();
                    match = true;
                    break;
                }
                outputQueue.push_back(operatorStack.top());
                operatorStack.pop();
            }
            if (!match) throw std::runtime_error("Mismatched parentheses");
        } else if (token.type == TokenType::Operator) {
            while (!operatorStack.empty() && operatorStack.top().type == TokenType::Operator) {
                std::string op1 = token.value;
                std::string op2 = operatorStack.top().value;
                
                if ((!isRightAssociative(op1) && precedence(op1) <= precedence(op2)) ||
                    (isRightAssociative(op1) && precedence(op1) < precedence(op2))) {
                    outputQueue.push_back(operatorStack.top());
                    operatorStack.pop();
                } else {
                    break;
                }
            }
            operatorStack.push(token);
        }
    }

    // Pop remaining operators
    while (!operatorStack.empty()) {
        if (operatorStack.top().type == TokenType::LeftParen) {
            throw std::runtime_error("Mismatched parentheses");
        }
        outputQueue.push_back(operatorStack.top());
        operatorStack.pop();
    }

    return outputQueue;
}

// --- PHASE 3: Evaluator ---
double evaluatePostfix(const std::vector<Token>& postfix) {
    std::stack<double> evalStack;
    for (const auto& token : postfix) {
        if (token.type == TokenType::Number) {
            evalStack.push(std::stod(token.value));
        } else if (token.type == TokenType::Operator) {
            if (evalStack.size() < 2) throw std::runtime_error("Invalid postfix expression");
            double b = evalStack.top(); evalStack.pop();
            double a = evalStack.top(); evalStack.pop();
            
            if (token.value == "+") evalStack.push(a + b);
            else if (token.value == "-") evalStack.push(a - b);
            else if (token.value == "*") evalStack.push(a * b);
            else if (token.value == "/") {
                if (b == 0) throw std::runtime_error("Division by zero");
                evalStack.push(a / b);
            }
            else if (token.value == "^") evalStack.push(std::pow(a, b));
        }
    }
    
    if (evalStack.size() != 1) throw std::runtime_error("Invalid postfix expression");
    return evalStack.top();
}