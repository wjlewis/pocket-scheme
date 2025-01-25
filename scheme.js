// A pocket-sized Scheme interpreter.

// + ---------------------- +
// | Tokenization & Parsing |
// + ---------------------- +

/**
 * Split `source` into an array of tokens.
 */
function lex(source) {
  const tokens = [];
  let pos = 0;

  function skipWhile(pred) {
    while (pos < source.length && pred(source[pos])) {
      pos += 1;
    }
  }

  function skipTrivia() {
    while (pos < source.length) {
      if (isWhitespace(source[pos])) {
        pos += 1;
      } else if (source[pos] === ';') {
        skipWhile(c => !'\n\r'.includes(c));
      } else {
        break;
      }
    }
  }

  skipTrivia();
  while (pos < source.length) {
    const start = pos;
    const c = source[pos];
    pos += 1;

    let type;
    if (c === '(') {
      type = 'LPAREN';
    } else if (c === ')') {
      type = 'RPAREN';
    } else if (c === '#') {
      if ('tf'.includes(source[pos])) {
        pos += 1;
        type = 'BOOL';
      } else {
        throw new Error('bad token');
      }
    } else if (isDigit(c)) {
      skipWhile(isDigit);
      type = 'NAT';
    } else if (startsSymbol(c)) {
      skipWhile(continuesSymbol);
      type = 'SYMBOL';
    } else {
      throw new Error('bad token');
    }

    const text = source.substring(start, pos);
    tokens.push({ type, text });

    skipTrivia();
  }
  return tokens;
}

function isWhitespace(c) {
  return ' \t\n\r'.includes(c);
}

function isDigit(c) {
  return '0' <= c && c <= '9';
}

function startsSymbol(c) {
  return (
    ('a' <= c && c <= 'z') ||
    ('A' <= c && c <= 'Z') ||
    '!#$^&*-_=+:<>/?'.includes(c)
  );
}

function continuesSymbol(c) {
  return startsSymbol(c) || isDigit(c);
}

/**
 * Parse the array of tokens `ts` into a "program", which is simply an array of
 * S-Expressions. S-Expressions are defined by the following grammar:
 *
 * ```plaintext
 * Program = SExpr*
 * SExpr = Atom
 *       | "(" SExpr* ")"
 * Atom = Int
 *      | Bool
 *      | Symbol
 * ```
 *
 * S-Expressions are represented using analogous JavaScript values.
 * Specifically:
 * - Nats are represented using numbers.
 * - Bools are represented using booleans.
 * - Symbols are represented using strings.
 * - Cons-cells are represented as objects with a `car` and `cdr` field.
 * - () is represented by `null`.
 *
 * N.B. `parse` consumes (i.e. mutates) the array of tokens provided to it.
 */
function parse(ts) {
  const exprs = [];
  while (ts.length > 0) {
    exprs.push(parseSExpr(ts));
  }
  return exprs;
}

function parseSExpr(ts) {
  if (ts[0].type === 'LPAREN') {
    return parseParend(ts);
  } else {
    return parseAtom(ts);
  }
}

function parseParend(ts) {
  const children = [];

  // Shift off the leading '('.
  ts.shift();
  while (ts.length > 0 && ts[0].type !== 'RPAREN') {
    children.push(parseSExpr(ts));
  }
  if (ts[0]?.type !== 'RPAREN') {
    throw new Error("missing ')'");
  }
  ts.shift();

  return children.reduceRight((cdr, car) => cons(car, cdr), null);
}

function parseAtom(ts) {
  switch (ts[0].type) {
    case 'NAT':
      return Number(ts.shift().text);
    case 'BOOL':
      return Boolean(ts.shift().text === '#t');
    case 'SYMBOL':
      return ts.shift().text;
    default:
      throw new Error('expected an atom');
  }
}

// + -------------------- +
// | Primitive Operations |
// + -------------------- +

function cons(car, cdr) {
  return { car, cdr };
}

function car(cons) {
  return cons.car;
}

function cdr(cons) {
  return cons.cdr;
}

function isNull(v) {
  return v === null;
}

function isEq(v1, v2) {
  return v1 === v2;
}

function isAtom(v) {
  return (
    typeof v === 'number' ||
    typeof v === 'boolean' ||
    typeof v === 'string' ||
    (typeof v === 'object' && v !== null && ('fn' in v || 'params' in v))
  );
}

function isZero(v) {
  return v === 0;
}

function add1(v) {
  return v + 1;
}

function sub1(v) {
  return v - 1;
}

function isNumber(v) {
  return typeof v === 'number';
}

function isEqual(v1, v2) {
  if (typeof v1 !== typeof v2) {
    return false;
  }
  if (!v1 || !v2 || typeof v1 !== 'object') {
    return isEq(v1, v2);
  }
  if ('car' in v1) {
    return isEqual(car(v1), car(v1)) && isEqual(cdr(v1), cdr(v2));
  } else if ('fn' in v1) {
    return v1.op === v2.op;
  } else {
    return false;
  }
}

function print(...args) {
  for (const val of args) {
    console.log(show(val));
  }
  return null;
}

function raise(v) {
  throw new Error(`expected ${show(v)}`);
}

const cadr = after(car, cdr);
const cddr = after(cdr, cdr);
const caddr = after(car, cddr);

// + --------- +
// | Execution |
// + --------- +

/**
 * Interpret a program by executing its S-Expressions in order.
 */
function interpret(program) {
  const globalEnv = {
    bindings: Object.fromEntries(
      [
        // Primitives used in _The Little Schemer_.
        ['cons', cons],
        ['car', car],
        ['cdr', cdr],
        ['null?', isNull],
        ['eq?', isEq],
        ['atom?', isAtom],
        ['zero?', isZero],
        ['add1', add1],
        ['sub1', sub1],
        ['number?', isNumber],
        // Primitives for printing and assertions.
        ['print', print],
        ['raise', raise],
      ].map(([name, fn]) => [name, { fn, name }])
    ),
    base: null,
  };

  for (const expr of program) {
    val(expr, globalEnv);
  }
}

/**
 * Produce the meaning/value of the provided `expr`ession, in the context of the
 * `env`ironment.
 */
function val(expr, env) {
  if (expr === null || typeof expr === 'number' || typeof expr === 'boolean') {
    return expr;
  } else if (typeof expr === 'string') {
    return lookup(expr, env);
  } else if (typeof expr === 'object') {
    switch (expr.car) {
      case 'quote':
        return cadr(expr);
      case 'cond':
        return valCond(expr, env);
      case 'or':
        return valOr(expr, env);
      case 'and':
        return valAnd(expr, env);
      case 'lambda':
        return valLambda(expr, env);
      case 'define':
        return valDefine(expr, env);
      default:
        return valApp(expr, env);
    }
  } else {
    throw new Error('bad s-expression');
  }
}

// (cond (<test> <rhs>)*)
// Within a given "clause", `else` is a synonym for #t.
function valCond(expr, env) {
  const clauses = toArray(cdr(expr));

  for (const clause of clauses) {
    const test = car(clause);
    if (test === 'else' || isTruthy(val(test, env))) {
      const rhs = cadr(clause);
      return val(rhs, env);
    }
  }

  return null;
}

function isTruthy(val) {
  return val !== false && val !== null;
}

// (or <lhs> <rhs>)
//
// "(or ...) asks two questions, one at a time. If the first one is true it
// stops and answers true. Otherwise it asks the second question and answers
// with whatever the second question answers."
function valOr(expr, env) {
  const lhs = cadr(expr);
  const rhs = caddr(expr);
  if (isTruthy(val(lhs, env))) {
    return true;
  }
  return val(rhs, env);
}

// (and <lhs> <rhs>)
function valAnd(expr, env) {
  const lhs = cadr(expr);
  const rhs = caddr(expr);
  if (isTruthy(val(lhs, env))) {
    return val(rhs, env);
  }
  return false;
}

// (lambda (<param>*) <body>)
function valLambda(expr, env) {
  const params = toArray(cadr(expr));
  const body = caddr(expr);
  return { params, body, env };
}

/**
 * Transform an S-List into an array of S-Expressions.
 */
function toArray(sList) {
  if (sList === null) {
    return [];
  } else {
    return [car(sList), ...toArray(cdr(sList))];
  }
}

// (define <symbol> <rhs>)
function valDefine(expr, env) {
  const symbol = cadr(expr);
  const rhs = caddr(expr);
  env.bindings[symbol] = val(rhs, env);
  return null;
}

// (<rator> <rand>*)
function valApp(expr, env) {
  const rator = car(expr);
  const rands = cdr(expr);

  const op = val(rator, env);
  const args = valRands(rands, env);

  return app(op, args);
}

function valRands(exprs, env) {
  if (exprs === null) {
    return [];
  } else {
    return [val(car(exprs), env), ...valRands(cdr(exprs), env)];
  }
}

function app(op, args) {
  if ('params' in op) {
    const env = extend(op.env, op.params, args);
    return val(op.body, env);
  } else if ('fn' in op) {
    return op.fn(...args);
  } else {
    throw new Error('bad operator');
  }
}

/**
 * Lookup the value of the symbol `sym` in the environment `env`.
 */
function lookup(sym, env) {
  if (sym in env.bindings) {
    return env.bindings[sym];
  } else if (env.base) {
    return lookup(sym, env.base);
  } else {
    throw new Error(`unbound name: '${sym}'`);
  }
}

/**
 * Construct a new environment that extends `env` by binding the symbols in
 * `params` to the values in `args`.
 */
function extend(env, params, args) {
  const bindings = Object.fromEntries(zip(params, args));
  return {
    bindings,
    base: env,
  };
}

// + --------------- +
// | Printing Values |
// + --------------- +

function show(value) {
  if (value === null) {
    return '()';
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (typeof value === 'boolean') {
    return value ? '#t' : '#f';
  } else if (typeof value === 'string') {
    return value;
  } else if (typeof value === 'object') {
    if ('car' in value) {
      return showCons(value);
    } else if ('params' in value) {
      return '#<closure>';
    } else if ('fn' in value) {
      return `#<primitive ${value.name}>`;
    } else {
      throw new Error('bad value');
    }
  } else {
    throw new Error('bad value');
  }
}

function showCons(cons) {
  return `(${showListOrPair(cons)})`;
}

function showListOrPair(cons) {
  return `${show(car(cons))}${showCdr(cdr(cons))}`;
}

function showCdr(expr) {
  if (expr === null) {
    return '';
  } else if (typeof expr === 'object' && 'car' in expr) {
    return ` ${showListOrPair(expr)}`;
  } else {
    return ` . ${show(expr)}`;
  }
}

// + ------------------- +
// | Miscellaneous Tools |
// + ------------------- +

/**
 * Compose `f` with `g`. That is, apply `f` _after_ `g`.
 */
function after(f, g) {
  return x => f(g(x));
}

/**
 * Zip two arrays into an array of pairs of elements.
 *
 * ## Example
 *
 * ```javascript
 * zip(['a', 'b', 'c'], [1, 2, 3]) == [['a', 1], ['b', 2], ['c', 3]]
 * ```
 */
function zip(xs, ys) {
  const zipped = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    const xi = xs[i];
    const yi = ys[i];
    zipped.push([xi, yi]);
  }
  return zipped;
}

module.exports = {
  exec: source => interpret(parse(lex(source))),
};
