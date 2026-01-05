export const CODE_TEMPLATES = {
  javascript: `// Enter your JavaScript code here
function solution(input) {
  const lines = input.trim().split('\\n');
  return output;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = '';
rl.on('line', (line) => {
  input += line + '\\n';
});

rl.on('close', () => {
  console.log(solution(input));
});`,

  python: `# Enter your Python code here
def solution(input_text):
    lines = input_text.strip().split('\\n')
    return output

if __name__ == "__main__":
    import sys
    input_text = sys.stdin.read()
    print(solution(input_text))`,

  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(NULL);
    return 0;
}`,

  java: `import java.util.*;
import java.io.*;
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        br.close();
    }
}`,

  c: `#include <stdio.h>
int main() { 
    return 0;
}`,

  csharp: `using System;
class Program {
    static void Main(string[] args) {
    }
}`,

  ruby: `def solution(input_text)
  lines = input_text.strip.split("\\n")
  output
end

input_text = STDIN.read
puts solution(input_text)`,

  go: `package main
import (
    "bufio"
    "os"
)
func main() {
    scanner := bufio.NewScanner(os.Stdin)
}`,

  typescript: `function solution(input: string): string {
  const lines = input.trim().split('\\n');
  return output;
}

import * as readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin, output: process.stdout
});
let input = '';
rl.on('line', (line) => input += line + '\\n');
rl.on('close', () => console.log(solution(input)));`,
};
