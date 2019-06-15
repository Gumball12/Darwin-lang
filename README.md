# Programming Language Darwin
_Darwin_ is a Simplest Lisp-like Functional Programming Language, used _Postfix_ notation.

```lisp
; in lisp
(+ 1 2)

; in Darwin
(1 2 +)
```

## Features

```lisp
; data types in Darwin

; boolean
0 ; false
1 ; true

; number
0 1 2 3 4 5 6 7 8 9

; string
A B C ... Z
a b c ... z
```

```lisp
; pre-defined functions in Darwin

; print value
(1 print) ; print 1

; logical operations
(1 1 1 and) ; 1
(1 1 0 and) ; 0

(1 1 0 or) ; 1
(0 0 0 or) ; 0

(1 not) ; 0
(0 not) ; 1

(1 1 1 eq) ; 1
("a" "a" "a" eq) ; 1
("a" 1 eq) ; 0

; inequality
(1 2 lt) ; 1 < 2 (= 1)
(1 2 gt) ; 1 > 2 (= 0)
(10 10 le) ; 10 <= 20 (= 1)
(10 10 ge) ; 10 >= 20 (= 1)

; arithmetic operations
(1 2 add) ; 1 + 2 (= 3)
(1 2 3 4 5 add) ; 1 + 2 + 3 + 4 + 5 (= 15)

(1 2 sub) ; 1 - 2 (= -1)

(1 2 mul) ; 1 * 2 (= 2)
(1 2 3 4 5 mul) ; 1 * 2 * 3 * 4 * 5 (= 120)

(1 2 div) ; 1 / 2 (= 0.5)

(2 2 mod) ; 2 % 2 (= 0)
```

```lisp
; define a variable in Darwin

(x 1 set) ; x := 1
(y x set) ; y := x
(y 4 set) ; y := 4
(x y set) ; x := y
```

```lisp
; lambda expression in Darwin

((x) (x print) lambda) ; x => console.log(x)
((x y) (y) lambda) ; (x, y) => y

; with 'set'

(first ((x y) (x) lambda) set) ; var first = (x, y) => x
(second ((x y) (y) lambda) set) ; var second = (x, y) => y
```

```lisp
; if statement in Darwin
; Darwin use that 'true-only' if statement

(
  (0 0 eq)
  ("0 equal to 0" print) ; printed
cond)
```

## Examples 
```lisp
; recurrence form

(recursive
  (i (
    (i print)
    (
      ((i 0 gt) (i-1 recursive))
      ((i 0 eq) 0)
    cond)
  ) lambda)
set)

(10 recursive) ; 10 9 8 7 6 5 4 3 2 1
```

---

## Flow
* lisp-like한 언어를 생각한 이유는?
  * side-effects가 없고, 각각을 블록 형태로 구현이 가능하기에
  * 프로그래밍을 처음 접하는 사람들에게 일반적인 언어보다 더 적절할 것이라 판단하였음
  * 프로그래밍에 대해 아예 처음 접하는 사람들을 위한 언어로 구상할 것이기에
    * list 처리에 적합했던 lisp와는 달리, list에 관련된 연산은 제외함

* 영어 어순인 prefix를 한국어 어순인 postfix로 바꿈으로서 얻을 수 있는 이점은?
  * 한국어 어순에 맞기에 좀 더 친근하게 프로그래밍 언어를 배울 수 있을 것

1. 이유
  * 함수형의 이점
  * 이를 한국어 어순에 맞게 구현해보면 어떨까 생각
2. 한국어 어순
  * 한국어 어순은 postfix라고 할 수 있음
  * 이에 대한 근거
3. 어휘분석기 오토마타 설계
4. 코드
  * insert: `((lambda (x) x) "Lisp")`
  * tokenization: `tokenize(<input code line>)`
    * `["(", "(", "lambda", "(", "x", ")", "x", ")", ""Lisp"", ")"]`
  * parenthesize: `parenthesize(<input token>)`
    * `[[{"type":"identifier","value":"lambda"},[{"type":"identifier","value":"x"}],{"type":"identifier","value":"x"}],{"type":"literal","value":"Lisp"}]`
5. 실행 및 웹 repl
