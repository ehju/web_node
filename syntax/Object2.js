//프로그래밍 : data / data 처리
// data를 담는 객체
// 처리하는 함수.

//js 에서의 함수 :  data의 처리방법을 담고있는 statement 이면서 값 이다 -> 변수에 넣을 수 있다.

var f = function() {
    console.log('A');
}
var a = [f]
a[0]();
var o = { func :f };

o.func();