from flask import request, jsonify, Blueprint
from utils import order_elliptic_curve
from sympy import isprime

point_order = Blueprint('point_order', __name__)
@point_order.route('/elliptic_curve/point_order', methods=['GET'])
def get_mul_elliptic_curve():
    """
    Multiply a point P on an elliptic curve defined by the equation y^2 = x^3 + ax + b by an integer k.
    """
    # Sanitize input
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    p = request.args.get('p', type=int)
    if x is None or y is None or a is None or b is None or p is None:
        return jsonify({"error": "Please provide 'x', 'y', 'k', 'a', 'b', and 'p' parameters."}), 400
    if p <= 0:
        return jsonify({"error": "Please provide a positive integer for 'p'."}), 400
    if not isprime(p):
        return jsonify({"error": "p must be a prime number."}), 400
        
    P = (x, y)
    # Check if point is on the curve
    if (y**2) % p != (x**3 + a*x + b) % p:
        return jsonify({"error": "Point P is not on the elliptic curve."}), 400
    result = order_elliptic_curve(P, a, b, p)
    return jsonify({"order": result}), 200