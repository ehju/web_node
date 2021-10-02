var members =[  'Mike' , 'Brian' ]
console.log(members[0]); // Mike
var i =0;
while(i<members.length){
    console.log('array loop', members[i]);
    i=i+1;
}
var roles = {
	'programmer':'Mike',
	'designer' : 'Brian'
}
console.log(roles.designer); //Brian
console.log(roles['designer']);

for(var name in roles){
    console.log('object =>', name);
}