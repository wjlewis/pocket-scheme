;;;; Playing around with Von Neumann Ordinals from Chapter 6 (p 107-108).

(define number?
  (lambda (x)
    (cond
      ((null? x) #t)
      (else (and (null? (car x))
                 (number? (cdr x)))))))

(define zero? null?)

(define zero (quote ()))

(define add1
  (lambda (n)
    (cons (quote ()) n)))

(define sub1 cdr)

(assert-eq? (number? zero) #t)

(assert-eq? (number? (add1 zero)) #t)

(assert-eq? (number? (quote (banana bread))) #f)

;; The following definitions are independent of the representation we choose.
;; They remain unchanged because they only interact with numbers via the
;; interface number?, zero?, add1, and sub1.
(define +
  (lambda (n m)
    (cond
      ((zero? m) n)
      (else (add1 (+ n (sub1 m)))))))

(assert-equal? (+ (add1 (add1 zero))
                  (add1 (add1 zero)))
               (add1 (add1 (add1 (add1 zero)))))

(define *
  (lambda (n m)
    (cond
      ((zero? m) zero)
      (else (+ n (* n (sub1 m)))))))

(assert-equal? (* (add1 (add1 (add1 zero)))
                  (add1 (add1 zero)))
               (add1 (add1 (add1 (add1 (add1 (add1 zero)))))))
