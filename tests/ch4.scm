(assert-eq? (atom? 14) #t)

(assert-eq? (add1 67) 68)

(assert-eq? (sub1 5) 4)

(assert-eq? (zero? 0) #t)

(assert-eq? (zero? 1492) #f)

(define +
  (lambda (n m)
    (cond
      ((zero? m) n)
      (else (add1 (+ n (sub1 m)))))))

(assert-eq? (+ 46 12) 58)

(define -
  (lambda (n m)
    (cond
      ((zero? m) n)
      (else (sub1 (- n (sub1 m)))))))

(assert-eq? (- 14 3) 11)

(assert-eq? (- 17 9) 8)

(define addtup
  (lambda (tup)
    (cond
      ((null? tup) 0)
      (else (+ (car tup)
               (addtup (cdr tup)))))))

(assert-eq? (addtup (quote (3 5 2 8)))
            18)

(assert-eq? (addtup (quote (15 6 7 12 3)))
            43)

(define *
  (lambda (n m)
    (cond
      ((zero? m) 0)
      (else (+ n (* n (sub1 m)))))))

(assert-eq? (* 5 3) 15)

(assert-eq? (* 13 4) 52)

(assert-eq? (* 12 3) 36)

(define tup+
  (lambda (tup1 tup2)
    (cond
      ((null? tup1) tup2)
      ((null? tup2) tup1)
      (else (cons (+ (car tup1) (car tup2))
                  (tup+ (cdr tup1) (cdr tup2)))))))

(assert-equal? (tup+ (quote (2 3))
                     (quote (4 6)))
               (quote (6 9)))

(define >
  (lambda (n m)
    (cond
      ((zero? n) #f)
      ((zero? m) #t)
      (else (> (sub1 n) (sub1 m))))))

(assert-eq? (> 12 133) #f)

(assert-eq? (> 120 11) #t)

(define <
  (lambda (n m)
    (cond
      ((zero? m) #f)
      ((zero? n) #t)
      (else (< (sub1 n) (sub1 m))))))

(assert-eq? (< 4 6) #t)

(assert-eq? (< 8 3) #f)

(assert-eq? (< 6 6) #f)

(define =
  (lambda (n m)
    (cond
      ((> n m) #f)
      ((< n m) #f)
      (else #t))))

(assert-eq? (= 3 3) #t)

(assert-eq? (= 4 6) #f)

(assert-eq? (= 8 3) #f)

(define ^
  (lambda (n m)
    (cond
      ((zero? m) 1)
      (else (* n (^ n (sub1 m)))))))

(assert-eq? (^ 1 1) 1)

(assert-eq? (^ 2 3) 8)

(assert-eq? (^ 5 3) 125)

(define /
  (lambda (n m)
    (cond
      ((< n m) 0)
      (else (add1 (/ (- n m) m))))))

(assert-eq? (/ 15 4) 3)

(define length
  (lambda (lat)
    (cond
      ((null? lat) 0)
      (else (add1 (length (cdr lat)))))))

(assert-eq? (length (quote (hotdogs with mustard sauerkraut and pickles)))
            6)

(define pick
  (lambda (n lat)
    (cond
      ((zero? (sub1 n)) (car lat))
      (else (pick (sub1 n) (cdr lat))))))

(assert-eq? (pick 4 (quote (lasagna spaghetti ravioli macaroni meatball)))
            (quote macaroni))

(define rempick
  (lambda (n lat)
    (cond
      ((zero? (sub1 n)) (cdr lat))
      (else (cons (car lat)
                  (rempick (sub1 n)
                           (cdr lat)))))))

(assert-equal? (rempick 3 (quote (hotdogs with hot mustard)))
               (quote (hotdogs with mustard)))

(define no-nums
  (lambda (lat)
    (cond
      ((null? lat) (quote ()))
      ((number? (car lat)) (no-nums (cdr lat)))
      (else (cons (car lat)
                  (no-nums (cdr lat)))))))

(assert-equal? (no-nums (quote (5 pears 6 prunes 9 dates)))
               (quote (pears prunes dates)))

(define all-nums
  (lambda (lat)
    (cond
      ((null? lat) (quote ()))
      ((number? (car lat))
       (cons (car lat) (all-nums (cdr lat))))
      (else (all-nums (cdr lat))))))

(assert-equal? (all-nums (quote (5 pears 6 prunes 9 dates)))
               (quote (5 6 9)))
