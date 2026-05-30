// console.log('Hello World!');
// console.error('This is an error message.');
// console.warn('This is a warning message.');
// console.table({ name: 'Alice', age: 30, city: 'New York' });
// console.time('Timer');

// // This line will not be running

// var x = 1; // number
// const y = 'Hello'; // string
// var z = true; // boolean
// var c = { name: 'Alice', age: 30 }; // object
// var d = ['alice', true, ['x', false, 0], 'akhshy', 'js', 'mern']; // array
// //        0        1     2                 3         4     5

// console.log(x) // 1
// x = 2
// console.log(x) // 2

// console.log(y) // Hello
// y = 'World' // Error: Assignment to constant variable.


// console.log(d[3]) // akhshy

// console.log(c.name) // Alice

// // variable types = var / const / let

// // hoisting


// document.getElementsByTagName
// document.getElementsByClassName
// document.getElementById
// document.querySelector
// document.querySelectorAll

// console.log(document.getElementsByTagName('h1')) // HTMLCollection(1) [h1.my-h1-tag]

// console.log(document.getElementsByClassName('my-h1-tag')) // HTMLCollection(1) [h1.my-h1-tag]

// console.log(document.getElementById('my-h2-tag')) // <h2 id="my-h2-tag">This is a heading 2</h2>

// console.log(document.querySelector('h1')) // <h1 class="my-h1-tag">JavaScript Basics</h1>

// console.log(document.querySelector('.my-h1-tag')) // <h1 class="my-h1-tag">JavaScript Basics</h1>

// console.log(document.querySelectorAll('#my-h2-tag')) // NodeList(1) [h2#my-h2-tag]


const h1Tag = document.querySelector('h1');

h1Tag.style.color = 'red';
h1Tag.style.backgroundColor = 'black';

// conditional statements

const age = 17;

if (age >= 18) {
  if (age >= 70) {
    console.log('You are a senior citizen, and cannot go for movies.');
  } else {
    console.log('You are allowed.');
  }
  console.log('You are allowed.');
} else if (age >= 16) {
  console.log('You are a child, but can go for movies with a parent.');
} else {
  console.log('You are not allowed.');
}

sum = (1 + 2) * ((3 - 4) / 2); // 1 + 6 - 2 = 5 BODMAS


// loops
// for loop / while loop / do while loop

// for (let i = 0; i < 5; i = i + 1) {
//   console.log(i);
// }

let count = 6;

while (count < 5) {
  console.log("while loop count ", count);
  count = count + 1;
}

let num = 6;

do {
  console.log("do while loop count ", num);
  num = num + 1;
} while (num < 5);

// functions

// const x = 10;
// const y = 20;

// console.log("x is ", x); // 10
// console.log("y is ", y); // 20
// console.log(x + y); // 30

// const a = 10;
// const b = 20;

// console.log("a is ", a); // 10
// console.log("b is ", b);
// console.log(a + b); // 30

function add(a, b) {
  console.log("a is , so you know the value", a);
  console.log(`a is ${a}, so you know the value`); // template literals
  console.log("b is ", b);
  console.log(a + b);
}

add(10, 20); // 30
add(5, 15); // 20
add(100, 200); // 300
add(7, 54); // 61


