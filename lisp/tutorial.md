# Lisp tutorial
* 영상: https://www.youtube.com/watch?v=ymSq4wHrqyU
* repl: https://www.tutorialspoint.com/execute_lisp_online.php

## Comments
* one line: `;`
* multiple line: `#|| ... ||#`

```lisp
; one line

#||
multiple line
multiple line
||#
```

## Print
`format` 을 사용하거나

```lisp
(format t "Hello World") ; meaning of 't' is 'output to the terminal'
(format t "Hello World ~%") ; '~%': with line break
```

`print` 를 사용함

```lisp
(print "What's your name?")
```

## Variables
`defvar` 사용해 정의가 가능. (_define variable = defvar_)

변수명은 다음과 같은 규칙을 따른다.

* `letters`, `numbers`, `+`, `-`, `_`, `*`, `=`, `<`, `>`, `?` 등을 변수 이름으로 사용할 수 있다.
* 대소문자 구분이 _없음_
* 당연히 whitespace는 변수명 사이에 들어갈 수 없다.

해보면 다음과 같다. 전역변수 선언 및 정의.

```lisp
; 변수 "name_is" 선언 및 "Darwin" 이라는 문자열 값으로 정의
(defvar name_is "Darwin")

; 심지어 다음과 같이도 가능
(defvar *name* "Darwin") ; OK
```

### Functions
함수는 `defun` 사용해 정의가 가능하다. (_define function = defun_)

이름 규칙은 변수명과 같음.

```lisp
(defun hello (name) ; 'name': argument
  (format t "Hello ~a! ~%" name) ; '~a': argument placeholder
)
```

`~a` 는 인자(argument)가 들어가는 자리. C의 printf 생각해보면 쉽게 이해가 될 것이다. tilde를 사용하는 다른 format에 대해서는 아래에서 다루도록 하겠음.

호출은 다음과 같다.

```lisp
(hello name_is) ; Hello Darwin!
```

위 코드를 한 번에 보면 다음과 같다.

```lisp
; print message
(print "What's your name?")

; define variable
(defvar name_is "Darwin")

; define function
(defun hello (name)
  ; print message with 'name' argument
  (format t "Hello ~a! ~%" name)
)

; call function
(hello name_is)
```

#### Override function
함수는 재정의 가능. 변수 재정의는 그냥 무시된다.

```lisp
(defvar n 10)

(defunc print_var (arg)
  (format t "~a ~%" arg)
)

(print_var n) ; output: 10

(defun print_var (arg)
  (format t "new print_var // ~a ~%" arg)
)

(print_var n) ; output: new print_var  10

(defvar n 12)

(print_var n) ; output: new print_var 10
```

변수 재정의는 `setf`를 통해 가능하다. 아래에서 다룸.

### Set variable
`setf` 를 통해 새로운 값을 정의할 수 있다.

```lisp
(defvar n 10)

(format t "~a ~%" n) ; output: 10

(setf n 12)

(format t "~a" n) ; output: 12
```

## User input
변수와 `(read)` 를 통해 입력을 받을 수 있다.

```lisp
(defvar name_is (read)) ; insert: "Darwin"

(format t "~a" name_is) ; output: DARWIN
```

출력이 대소문자 구분 없이 `DARWIN`으로 출력됨을 볼 수 있는데, 이는 말했듯이 lisp가 대소문자 구분이 없기 때문에 입력도 그렇게 들어오는 것.

이는 다음과 같은 구문을 추가해줌으로써 원하는대로 해줄 수 있다.

```lisp
(defvar name_is (read)) ; insert: "darwin"

(setq *print-case* :capitalize) ; 첫글자만 대문자로

(format t "~a" name_is) ; output: Darwin
```

`*print-case*` 변수가 출력에 대한 case를 지정하는 것이기에, 출력 전에 값을 정의해줘야한다. 참고로 `:capitalize` 말고도 다음의 값들이 있다.

* `:capitalize`
* `:upcase`
* `:downcase`

```lisp
(defvar name_is (read)) ; insert: "darWin"

(setq *print-case* :capitalize)

(format t "~a ~%" name_is) ; output: "Darwin"

(setq *print-case* :upcase)

(format t "~a ~%" name_is) ; output: "DARWIN"

(setq *print-case* :downcase)

(format t "~a" name_is) ; output: "darwin"
```

### Tilde format
`~a`, `~%` 말고도 다음이 있다.

* `~a`: argument placeholder
* `~s`: shows quotes(`" "`) around the value
* `~d`: number format
* `~10a`: Adds 10 spaces for the value with extra space to the _right_
* `~10@a`: Add 10 spaces for the value with extra space to the _left_

물론 이것들 말고도 더 많다.

```lisp
(format t "~a / ~s ~%" "without quotes" "with quotes")
; output: 'without quotes / "with quotes"

(format t "~10a / ~10@a" "A" "A")
; output: A          /          A

(format t "~:d" 10000000) ; Number with commas
; output: 10,000,000

(format t "~5f" 3.141593) ; 5 characters
; output: 3.142

(format t "~,4f" 3.141593) ; 4 decimals
; output: 3.141610

(format t "~,,2f" .10) ; 10 percent
; output: 10.010

(format t "~$" 10) ; 10 dollars
; output: 10.00
```

## Forms
lisp에서는 다음과 같이 계산을 진행할 수 있다.

```lisp
(+ 5 7) ; 12
```

여기서 `+`는 function name이고, `5`와 `7`은 parameter이다.

좀 더 functional한 예제를 보자면...

```lisp
(+ 5 (- 6 1)) ; 10
```

가장 안의 함수부터 계산되어 `10` 이라는 결과가 나온다. 이게 바로 _functional language_ 인 LISP의 특징.

몇 가지 해 보면 다음과 같다.

```lisp
(format t "~d ~%" (+ 5 4)) ; output: 9

(format t "~d ~%" (- 5 4)) ; output: 1

(format t "~d ~%" (* 5 4)) ; output: 20

(format t "~d ~%" (/ 5 4)) ; output: 5/4

(format t "~d ~%" (/ 5 4.0)) ; output: 1.25

(format t "~d ~%" (rem 5 4)) ; output: 1

(format t "~d ~%" (mod 5 4)) ; output: 1
```

`(/ 5 4)`의 결과가 `5/4`가 된다는 것을 주의하자.

`rem`과 `mod`는 둘 다 나머지 연산이라는 것은 같은데, negative operand에 대해서는 다른 결과를 갖는다. `mod`는 positive한 결과를 갖도록 하고, `rem`은 negative한 결과를 갖는다고 생각하면 되는데, [자세한 것은 SO 참고.](https://stackoverflow.com/questions/13683563/whats-the-difference-between-mod-and-remainder)

### Other different math calculations

```lisp
(format t "~d ~%" (expt 4 2)) ; output: 16

(format t "~d ~%" (sqrt 81)) ; output: 9

(format t "~d ~%" (exp 1)) ; output: 2.7182817

(format t "~d ~%" (log 1000 10)) ; output: 3

(format t "~d ~%" (equal 'dog 'dog)) ; output: T
(format t "~d ~%" (equal 10 10)) ; output: T
(format t "~d ~%" (equal 5.5 5.3)) ; output: Nil
(format t "~d ~%" (equal "dog" "dog")) ; output: T
(format t "~d ~%" (equal (list 1 2 3) (list 1 2 3))) ; output: T

(format t "~d ~%" (eq "dog" "dog")) ; output: Nil
; eq ≠ equal

(format t "~d ~%" (floor 5.5)) ; output: 5

(format t "~d ~%" (ceiling 5.5)) ; output: 6

(format t "~d ~%" (max 5 10)) ; output: 10

(format t "~d ~%" (min 5 10)) ; output: 5

(format t "~d ~%" (oddp 15)) ; output: T

(format t "~d ~%" (evenp 15)) ; output: Nil

(format t "~d ~%" (numberp 2)) ; output: T

(format t "~d ~%" (null null)) ; output: T
```

* `T`: True
* `Nil`: False와 비슷한 의미
* `'dog`: `'`가 붙은 경우, 실행(evaluate)하지 않는 코드를 의미 ([SO](https://stackoverflow.com/a/134908))

이 말고도 `sin`, `cos`, `atan` 뭐 이런 삼각함수도 있다.

#### `eq` and `equal`
`eq`는 hard check, `equal`은 rough check 라고 생각하면 된다. 다시말해, `eq`의 경우 완전히 같은 object여야만 `T`가 되는 것이고, `equal`은 의미만 같으면 `T`가 되는 것.

대충 이정도만 알고있으면 된다. 자세한 것은 [SO](https://stackoverflow.com/questions/547436/whats-the-difference-between-eq-eql-equal-and-equalp-in-common-lisp) 참고.

---


