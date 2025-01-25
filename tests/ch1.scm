(assert-eq? (car (quote (a b c))) (quote a))

(assert-equal? (car (quote ((a b c) x y z)))
               (quote (a b c)))

(assert-equal? (car (quote (((hotdogs)) (and) (pickle) relish)))
               (quote ((hotdogs))))

(assert-equal? (car (car (quote (((hotdogs)) (and) (pickle) relish))))
               (quote (hotdogs)))

(assert-equal? (cdr (quote (a b c)))
               (quote (b c)))

(assert-equal? (cdr (quote ((a b c) x y z)))
               (quote (x y z)))

(assert-equal? (cdr (quote (hamburger)))
               ())

(assert-equal? (cons (quote peanut)
                     (quote (butter and jelly)))
               (quote (peanut butter and jelly)))

(assert-equal? (cons (quote ((help) this))
                     (quote (is very ((hard) to learn))))
               (quote (((help) this) is very ((hard) to learn))))

(assert-eq? (null? (quote ()))
            #t)

(assert-eq? (null? (quote (a b c)))
            #f)

(assert-eq? (atom? (quote Harry))
            #t)

(assert-eq? (atom? (quote (Harry had a heap of apples)))
            #f)

(assert-eq? (atom? (car (quote (Harry had a heap of apples))))
            #t)

(assert-eq? (quote Harry) (quote Harry))

(assert-eq? (eq? (quote margarine) (quote butter))
            #f)
