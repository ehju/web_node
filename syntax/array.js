//CRUD
var arr = ["A","B","C","D",1,true];
console.log(arr);
console.log(arr.length);
console.log(arr.find(element => element===true));
console.log(arr.find(element => element==="A"));
console.log(arr.find(element => element==="fd"));
arr[2]="c";
console.log(arr);
console.log(arr.includes("A"));
arr.push("E");
console.log(arr);
arr.unshift(0);
console.log(arr);