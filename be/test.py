from math import gcd
import math

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
    if P == ("\\infty", "\\infty") or Q == ("\\infty", "\\infty"): return ("\\infty", "\\infty")
    if P == Q:
        if P == O:
            return ("\\infty", "\\infty")
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
            return ("\\infty", "\\infty")
        elif P == O and Q != O:
            return Q
        elif P != O and Q == O:
            return P
        else:
            return ("\\infty", "\\infty")
        

if __name__ == "__main__":
    P = (2, 3)
    result = add_elliptic_curve(P, P, 3, 8, 13)
    print(result)