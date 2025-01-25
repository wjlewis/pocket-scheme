(define numbered?
  (lambda (aexp)
    (cond
      ((atom? aexp) #t)
      (else
       (and (numbered? (car aexp))
            (numbered? (car (cdr (cdr aexp)))))))))

(assert-eq? (numbered? (quote (3 + (4 * 5))))
            #t)

;; From ch4.scm.
(define +
  (lambda (n m)
    (cond
      ((zero? m) n)
      (else (add1 (+ n (sub1 m)))))))

(define *
  (lambda (n m)
    (cond
      ((zero? m) 0)
      (else (+ n (* n (sub1 m)))))))

(define ^
  (lambda (n m)
    (cond
      ((zero? m) 1)
      (else (* n (^ n (sub1 m)))))))

(define value
  (lambda (nexp)
    (cond
      ((atom? nexp) nexp)
      ((eq? (car (cdr nexp)) (quote +))
       (+ (value (car nexp))
          (value (car (cdr (cdr nexp))))))
      ((eq? (car (cdr nexp)) (quote *))
       (* (value (car nexp))
          (value (car (cdr (cdr nexp))))))
      (else
       (^ (value (car nexp))
          (value (car (cdr (cdr nexp)))))))))

(assert-eq? (value (quote (1 + (3 * 4))))
            13)
