# A Pocket-Sized Scheme

Behold!
A Scheme implementation rich enough to complete every exercise in _The Little
Schemer_, yet small enough to fit in your pocket.

This was hacked together one cold, dark January morning.
I needed a simple implementation of an interpreter for a blog post I was
writing, and Scheme fit the bill.
But I couldn't have anticipated the warmth it brought me to revisit _The Little Schemer_ in this fashion.
The book is truly a feast.

## Notable Features

The [tests](./tests/) directory contains a battery of tests taken directly from
_The Little Schemer_.
These are just plain Scheme files, executed using a custom test runner.
Tests are written using a family of `assert-` functions, like so:

```scheme
;; my-test.scm
(assert-equal? (quote (bacon lettuce tomato))
               (quote (bacon lettuce)))
```

Executing the test runner on this file reports an error:

```
Failure: expected (equal? (bacon lettuce tomato) (bacon lettuce))
  in my-test.scm
```

The `assert-` functions are themselves _also_ written in Scheme (and executed by
the interpreter defined in [_scheme.js_](./scheme.js)).
They're defined in [_tests/\_lib.scm_](./tests/_lib.scm).
As a result, it's easy to add new assertion functions for common cases.
For instance, if we find ourselves often asserting that a value is true:

```scheme
(assert-eq? foo #t)
(assert-eq? bar #t)
(assert-eq? quux #t)
;; ...
```

We can save ourselves a little typing (and introduce some clarity to the tests)
by abstracting this pattern into an `assert-true` function:

```scheme
(define assert-true
  (lambda (v)
    (cond
      (v #t)
      (else (raise (cons v (quote (to be #t))))))))
```

Assertions are powered by `raise`, a primitive function that throws a JavaScript
error that includes the single argument to `raise` in its message.
That is, running the test runner on a file containing:

```scheme
(assert-true (or #f #f))
```

will result in an error message like:

```
Failure: expected (#f to be #t)
  in ch1.scm
```

### Running the Tests

Run all of the tests via:

```
npm run test
```

or only the subset from files matching `<pattern>`:

```
npm run test -- <pattern>
```

For example, to run only the tests from [_tests/ch3.scm_](./tests/ch3.scm):

```
npm run test -- ch3
```
