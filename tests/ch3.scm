(define rember
  (lambda (a lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) a) (cdr lat))
      (else (cons (car lat)
                  (rember a (cdr lat)))))))

(assert-equal? (rember (quote and)
                       (quote (bacon lettuce and tomato)))
               (quote (bacon lettuce tomato)))

(define firsts
  (lambda (l)
    (cond
      ((null? l) (quote ()))
      (else (cons (car (car l))
                  (firsts (cdr l)))))))

(assert-equal? (firsts (quote ((apple peach pumpkin)
                               (plum pear cherry)
                               (grape raisin pea)
                               (bean carrot eggplant))))
               (quote (apple plum grape bean)))

(assert-equal? (firsts (quote ((a b) (c d) (e f))))
               (quote (a c e)))

(assert-equal? (firsts (quote ((five plums)
                               (four)
                               (eleven green oranges))))
               (quote (five four eleven)))

(define insertR
  (lambda (new old lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) old)
       (cons old (cons new (cdr lat))))
      (else (cons (car lat)
                  (insertR new old (cdr lat)))))))

(assert-equal? (insertR (quote jalapeno)
                        (quote and)
                        (quote (tacos tamales and salsa)))
               (quote (tacos tamales and jalapeno salsa)))

(define insertL
  (lambda (new old lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) old)
       (cons new lat))
      (else (cons (car lat)
                  (insertL new old (cdr lat)))))))

(assert-equal? (insertL (quote d)
                        (quote e)
                        (quote (a b c e)))
               (quote (a b c d e)))

(define subst
  (lambda (new old lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) old)
       (cons new (cdr lat)))
      (else (cons (car lat)
                  (subst new old (cdr lat)))))))

(assert-equal? (subst (quote topping)
                      (quote fudge)
                      (quote (ice cream with fudge for dessert)))
               (quote (ice cream with topping for dessert)))

(define multirember
  (lambda (a lat)
    (cond
      ((null? lat) (quote ()))
      ((eq? (car lat) a)
       (multirember a (cdr lat)))
      (else (cons (car lat)
                  (multirember a (cdr lat)))))))

(assert-equal? (multirember (quote cup)
                            (quote (coffee cup tea cup and hick cup)))
               (quote (coffee tea and hick)))
