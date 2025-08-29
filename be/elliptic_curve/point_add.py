from flask import request, jsonify, Blueprint
from utils import add_elliptic_curve
from sympy import isprime

points_add = Blueprint('points_add', __name__)
@points_add.route('/elliptic_curve/points_add', methods=['GET'])
def get_add_elliptic_curve():
    """
    Add two points P and Q on an elliptic curve defined by the equation y^2 = x^3 + ax + b.
    """
    # Sanitize input
    x1 = request.args.get('x1', type=int)
    y1 = request.args.get('y1', type=int)
    x2 = request.args.get('x2', type=int)
    y2 = request.args.get('y2', type=int)
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    p = request.args.get('p', type=int)

    if x1 is None or y1 is None or x2 is None or y2 is None or a is None or b is None or p is None:
        return jsonify({"error": "Please provide 'x1', 'y1', 'x2', 'y2', 'a', 'b', and 'p' parameters."}), 400
    if p <= 0:
        return jsonify({"error": "Please provide a positive integer for 'p'."}), 400
    if not isprime(p):
        return jsonify({"error": "p must be a prime number."}), 400

    P = (x1, y1)
    Q = (x2, y2)

    # Check if points are on the curve
    if (y1**2) % p != (x1**3 + a*x1 + b) % p:
        return jsonify({"error": "Point P is not on the elliptic curve."}), 400
    if (y2**2) % p != (x2**3 + a*x2 + b) % p:
        return jsonify({"error": "Point Q is not on the elliptic curve."}), 400

    result = add_elliptic_curve(P, Q, a, b, p)
    
    return jsonify({"result": result}), 200