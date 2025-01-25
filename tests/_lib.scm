;;;; A simple assertion library to support unit testing.

(define assert
  (lambda (v msg)
    (cond
      (v #t)
      (else (raise msg)))))

(define assert-bin
  (lambda (op name)
    (lambda (lhs rhs)
      (assert (op lhs rhs)
              (list3 name lhs rhs)))))

(define list3
  (lambda (x y z)
    (cons x (cons y (cons z (quote ()))))))

(define assert-eq? (assert-bin eq? (quote eq?)))

(define equal?
  (lambda (lhs rhs)
    (cond
      ((atom? lhs) (eq? lhs rhs))
      ((atom? rhs) #f)
      ((null? lhs) (null? rhs))
      ((null? rhs) #f)
      (else (and (equal? (car lhs) (car rhs))
                 (equal? (cdr lhs) (cdr rhs)))))))

(define assert-equal? (assert-bin equal? (quote equal?)))
