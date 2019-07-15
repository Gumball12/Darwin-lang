# Programming Language Darwin 🐟
_Darwin_ is a Simplest Lisp-like Functional Programming Language, used _Postfix_ notation.

```lisp
; in lisp
(+ 1 2)

; in Darwin
(1 2 +)
```

It looks like _Korean._ not English.

[And you can try this](https://bit.ly/2WCCA56). I implemented web REPL.

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

## Interpret flow
This is interpret flow about Darwin🐟 language.

1. insert code: `((lambda (x) x) "Lisp")`
2. tokenization: `tokenize(<input each code line>)`
  * `["(", "(", "lambda", "(", "x", ")", "x", ")", ""Lisp"", ")"]`
3. parenthesize: `parenthesize(<input tokens>)`
  * `[[{"type":"identifier","value":"lambda"},[{"type":"identifier","value":"x"}],{"type":"identifier","value":"x"}],{"type":"literal","value":"Lisp"}]`
4. evaluated parenthesized code
