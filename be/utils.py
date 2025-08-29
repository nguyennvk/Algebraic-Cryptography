import math
from sympy import factorint
from itertools import product

def euler_totient(n, factorize=None):
    """
    Calculate the Euler's totient function for a given integer n.
    The function counts the positive integers up to n that are relatively prime to n.
    """
    if n == 1:
        return 1
    if factorize is not None:
        result = n
        for p in factorize.keys():
            result -= result // p
        return result
    result = n
    p = 2
    while p * p <= n:
        if n % p == 0:
            while n % p == 0:
                n //= p
            result -= result // p
        p += 1
    if n > 1:
        result -= result // n
    return result


def single_carmicheal(p, k):
    if p >= 3:
        return euler_totient(pow(p, k), factorize={p: k})
    elif p == 2:
        if k <= 2:
            return euler_totient(pow(p, k), factorize={p: k})
        else:
            return euler_totient(pow(p, k), factorize={p: k}) // 2
        

def factor_2(n):
    """
    Factor out the largest power of 2 from n.
    Returns the exponent of 2 and the odd part of n.
    """
    if n == 0:
        return 0
    if n < 0:
        n = -n
    k = 0
    while n % 2 == 0:
        n //= 2
        k += 1
    return k


def jacobi_symbol(a, n):
    """
    Calculate the Jacobi symbol (a/n) using the law of quadratic reciprocity.
    """
    if n <= 0:
        return 0
    elif a == 0:
        return 0
    elif a == 1:
        return 1
    elif a == 2:
        return (-1) ** ((n**2 - 1) // 8)
    elif a%2 == 0:
        k = factor_2(a)
        a //= 2**k
        return jacobi_symbol(2, n)**k * jacobi_symbol(a, n)
    else:
        if a > n:
            return jacobi_symbol(a % n, n)
        else:
            return (-1) ** ((n - 1) * (a - 1) // 4) * jacobi_symbol(n%a, a)
        
        
class Term:
    def __init__(self, coeff, exp):
        self.coeff = coeff
        self.exp = exp


    def __repr__(self):
        return f"{self.coeff}x^{self.exp}"
    

    def value(self, x):
        return self.coeff * (x ** self.exp)


class Polynomial:
    def __init__(self, coeffs):
        self.terms = []
        self.degree = len(coeffs) - 1

        for c in range(len(coeffs)):
            self.terms.append(Term(coeffs[c], c))
        self.coeffs = {term.exp: term.coeff for term in self.terms}


    def __repr__(self):
        return " + ".join(str(term) for term in self.terms)
    

    def to_json(self):
        json = {}
        for x in self.terms:
            json[x.exp] = x.coeff
        return json
    

    def eval(self, x):
        # Evaluate the polynomial at a given value x
        return sum(term.value(x) for term in self.terms)


def is_irreducible(poly, p):
    for x in range(p):
        if poly.eval(x) % p == 0:
            return False
    return True


def get_irreducible_polynomial(p, d):
    """
    Generate an irreducible polynomial of degree n over GF(p).
    """
    if p <= 0 or d <= 0:
        raise ValueError("p and n must be positive integers.")
    
    # Generate a random polynomial of degree n
    for first_term in range(1, p):
        for x in list(product(range(p), repeat=d)):
            coeffs = list(x) + [first_term]
            poly = Polynomial(coeffs)
            if is_irreducible(poly, p):
                return poly
    return None


def polinomial_addition(a, b, p, irreducible_poly=None):
    """
    Perform addition in GF(p^d).
    a, b, irreducible_poly are polynomials represented as a map of degree and coefficients.
    {
        "0": 2,
        "1": 2,
        "2": 2
    }
    p are the field that the polynomial is in.
    """
    result = {}
    for degree in a:
        result[degree] = (a[degree]+b.get(degree, 0)) % p
    return result


def polinomial_multiplication(a, b, p):
    """
    Perform multiplication in GF(p).
    
    a, b: polynomials represented as dict {degree: coefficient}.
    p: prime field characteristic.
    
    Returns: dict {degree: coefficient} result.
    """
    result = {}
    for deg_a, coef_a in a.items():
        for deg_b, coef_b in b.items():
            deg = deg_a + deg_b
            coef = (coef_a * coef_b) % p
            if deg in result:
                result[deg] = (result[deg] + coef) % p
            else:
                result[deg] = coef
    return result

def degree(poly):
    """
    Get the degree of a polynomial.
    
    poly: polynomial represented as dict {degree: coefficient}.
    
    Returns: int degree of the polynomial.
    """
    for x in range(len(poly)-1, -1, -1):
        if poly[x] != 0:
            return x
    return -1

def polinomial_modulo(divident, divisor, p):
    """
    Perform polynomial modulo in GF(p).
    
    a, b: polynomials represented as dict {degree: coefficient}.
    p: prime field characteristic.
    irreducible_poly: dict {degree: coefficient} if given, else no reduction.
    
    Returns: dict {degree: coefficient} result.
    """
    if degree(divident) < degree(divisor):
        return divident
    else:
        quotient = {}
        max_deg_divisor = degree(divisor)
        max_deg_divident = degree(divident)
        coeff_divisor = divisor[max_deg_divisor]
        coeff_divident = divident[max_deg_divident]
        quotient[max_deg_divident - max_deg_divisor] = (coeff_divident * pow(coeff_divisor, -1, p)) % p
        for x in quotient:
            quotient[x] = -1* quotient[x]
        product = polinomial_multiplication(quotient, divisor, p)
        remainder = polinomial_addition(divident, product, p)
        return polinomial_modulo(remainder, divisor, p)

    
def field_multiplication(a, b, p, irreducible_poly=None):
    """
    Perform multiplication in GF(p^d).
    
    a, b: polynomials represented as dict {degree: coefficient}.
    p: prime field characteristic.
    irreducible_poly: dict {degree: coefficient} if given, else no reduction.
    
    Returns: dict {degree: coefficient} result.
    """
    # Step 1: Raw polynomial multiplication
    result = polinomial_multiplication(a, b, p)

    # Step 2: Reduce modulo irreducible polynomial if provided
    if irreducible_poly:
        pass
    # Clean up zeros
    result = {deg: coef for deg, coef in result.items() if coef != 0}
    
    return result


def shank_dlp(g, y, p):
    """
    Shank's algorithm for discrete logarithm.
    
    g: base
    y: target
    p: prime modulus
    
    Returns: x such that g^x ≡ y (mod p)
    """
    m = math.isqrt(p) + 1
    L1 = {pow(g, j, p): j for j in range(m+1)}
    L2 = {(y * pow(g, -i*m, p))%p: i for i in range(m+1)}

    map_list2 = {val: idx for idx, val in enumerate(L2)}
    for idx1, val in enumerate(L1):
        if val in map_list2:
            return idx1, map_list2[val]  # return indices from list1 and list2
    
    return None


def eval_poly(poly, x):
    """
    Evaluate polynomial at x.
    
    poly: polynomial represented as dict {degree: coefficient}.
    x: value to evaluate at.
    
    Returns: evaluated value.
    """
    return sum(coef * (x ** deg) for deg, coef in poly.items())


def add_elliptic_curve(P: tuple, Q: tuple, a: int, b: int, p=math.inf) -> tuple:
    """
    Add two points P and Q on an elliptic curve defined by the equation y^2 = x^3 + ax + b.
    
    Args:
        P (tuple): Coordinates of point P (x1, y1).
        Q (tuple): Coordinates of point Q (x2, y2).
        a (int): Coefficient a in the elliptic curve equation.
        b (int): Coefficient b in the elliptic curve equation.
        p (int): Prime number defining the finite field.
    
    Returns:
        tuple: Coordinates of the resulting point R = P + Q.
    """
    O = (math.inf, math.inf)  # Point at infinity
    x1, y1 = P
    x2, y2 = Q
    if P == ("\infty", "\infty") or Q == ("\infty", "\infty"): return ("\infty", "\infty")
    if P == Q:
        if P == O:
            return O
        else:
            x3 = 3*x1**2 + a
            i = pow(2*y1, -1, p) if p != math.inf else pow(2*y1, -1)
            x3 = (((3*x1**2 + a) * i) **2 -2*x1 )% p if p != math.inf else ((3*x1**2 + a) * i) **2 -2*x1
            y3 = ((3*x1**2 + a) * i * (x1 - x3) - y1) % p if p != math.inf else ((3*x1**2 + a) * i * (x1 - x3) - y1)
            return (x3, y3)
    else:
        if P != O and Q != O and x1 != x2:
            m = (y2 - y1) * pow(x2 - x1, -1, p) % p if p != math.inf else (y2 - y1) * pow(x2 - x1, -1)
            x3 = (m**2 - x1 - x2) % p if p != math.inf else (m**2 - x1 - x2)
            y3 = (m*(x1-x3) - y1) % p if p != math.inf else (m*(x1-x3) - y1)
            return (x3, y3)
        elif P != O and Q != O and x1 == x2:
            return ("\infty", "\infty")
        elif P == O and Q != O:
            return Q
        elif P != O and Q == O:
            return P
        else:
            return ("\infty", "\infty")


def order_elliptic_curve(P: tuple, a: int, b: int, p: int) -> int:
    """
    Calculate the order of the elliptic curve point P.
    
    Args:
        P (tuple): Coordinates of point P (x1, y1).
        a (int): Coefficient a in the elliptic curve equation.
        b (int): Coefficient b in the elliptic curve equation.
        p (int): Prime number defining the finite field.
    
    Returns:
        int: Order of the point P.
    """
    O = (math.inf, math.inf)  # Point at infinity
    count = 1
    current_point = P
    while current_point != O:
        count += 1
        current_point = add_elliptic_curve(current_point, P, a, b, p)
    return count


def multiply_elliptic_curve(n: int, P: tuple[int], a: int, b: int, p: int):
    """
    Calculate n * P on the elliptic curve defined by y^2 = x^3 + ax + b.
    """
    O = (math.inf, math.inf)
    new_P = (P[0], P[1])
    for i in range(n-1):
        new_P = add_elliptic_curve(new_P, P, a, b, p)
    return new_P

