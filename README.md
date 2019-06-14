# Programming Language Darwin
_Darwin_ is a Simplest Lisp-like postfix Functional Programming Language.

```lisp
; in lisp
(+ 1 2)

; in Darwin
(1 2 +)
```

```lisp
; in Darwin

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

## Features
* lisp-like한 언어를 생각한 이유는?
  * side-effects가 없고, 각각을 블록 형태로 구현이 가능하기에
  * 프로그래밍을 처음 접하는 사람들에게 일반적인 언어보다 더 적절할 것이라 판단하였음
  * 프로그래밍에 대해 아예 처음 접하는 사람들을 위한 언어로 구상할 것이기에
    * list 처리에 적합했던 lisp와는 달리, list에 관련된 연산은 제외함

* 영어 어순인 prefix를 한국어 어순인 postfix로 바꿈으로서 얻을 수 있는 이점은?
  * 한국어 어순에 맞기에 좀 더 친근하게 프로그래밍 언어를 배울 수 있을 것

## Flow
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
