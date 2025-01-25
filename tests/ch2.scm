(define lat?
  (lambda (l)
    (cond
      ((null? l) #t)
      ((atom? (car l)) (lat? (cdr l)))
      (else #f))))

(assert-eq? (lat? (quote (bacon and eggs)))
            #t)

(assert-eq? (lat? (quote (bacom (and eggs))))
            #f)

(assert-eq? (or (null? (quote ()))
                (atom? (quote (d e f g))))
            #t)

(assert-eq? (or (null? (quote (a b c)))
                (null? (quote (atom))))
            #f)

(define member?
  (lambda (a lat)
    (cond
      ((null? lat) #f)
      (else (or (eq? (car lat) a)
                (member? a (cdr lat)))))))

(assert-eq? (member? (quote meat)
                     (quote (mashed potatoes and meat gravy)))
            #t)


(assert-eq? (member? (quote liver)
                     (quote (bagels and lox)))
            #f)
