# Programming Language Darwin
_Darwin_ is a Simplest Lisp-like postfix Functional Programming Language.

```lisp
; in lisp
(+ 1 2)

; in Darwin
(1 2 +)
```

```lisp
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
* prefix를 postfix로 바꿈으로서 얻을 수 있는 이점은?
  * 한국어 어순에 맞기에 

## Flow
1. LISP에 대한 간단한 소개 (s-exp 위주)
2. 여기서 한국어 어순에 맞게 postfix로 해 보면 어떨까 생각
  * english의 prefix와 korean의 postfix 차이
  * 이를 실제 코드에서는 어떻게 보여질 것인가 차이
3. 이 언어에 대한 BNF 차이
  * LISP BNF는 굳이 안보여줘도 되나?
  * 모호한 문법은 나오지 않음을 check해야하나?
4. 어휘분석기 오토마타 설계
  * 이와 같이 interpreter를 설계하면 되는 것인지
