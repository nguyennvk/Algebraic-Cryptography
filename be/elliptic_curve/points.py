from flask import request, jsonify, Blueprint
from sympy import isprime
from math import inf

points = Blueprint('points', __name__)
@points.route('/elliptic_curve/points', methods=['GET'])
def get_determinant():
    """
    Calculate the determinant of an elliptic curve given the coefficients a, b, and p.
    """
    # Sanitize input
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    p = request.args.get('p', type=int)
    if a is None or b is None or p is None:
        return jsonify({"error": "Please provide 'a', 'b', and 'p' parameters."}), 400
    if p <= 0:
        return jsonify({"error": "Please provide a positive integer for 'p'."}), 400
    if not isprime(p):
        return jsonify({"error": "p must be a prime number."}), 400
    if (4 * a**3 + 27 * b**2) % p == 0:
        return jsonify({"determinant": 0, "message": "The elliptic curve is singular."}), 400

    points = [("\infty", "\infty")]  # Start with the point at infinity
    for x in range(p):
        for y in range(p):
            if (y**2) % p == (x**3 + a*x + b) % p:
                points.append((x, y))
    return jsonify({"points": points}), 200
