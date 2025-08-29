from flask import request, jsonify, Blueprint
from sympy import isprime
from utils import multiply_elliptic_curve, add_elliptic_curve

elliptic_curve_signature = Blueprint('elliptic_curve_signature', __name__)
@elliptic_curve_signature.route('/signature/elliptic_curve_signature', methods=['GET'])
def get_elgamal_signature():
    """
    Verify whether Alice is authenticated by Bob using the Elgamel signature scheme.
    """
    # Sanitize input
    # Public key
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)
    p = request.args.get('p', type=int)
    x = request.args.get('x', type=int)
    y = request.args.get('y', type=int)
    x_a = request.args.get('x_a', type=int)
    y_a = request.args.get('y_a', type=int)
    d = request.args.get('d', type=int)
    s1 = request.args.get('s1', type=int)
    s2 = request.args.get('s2', type=int)
    r = request.args.get('r', type=int)
    if a is None or b is None or p is None or x is None or y is None or x_a is None or y_a is None or d is None or s1 is None or s2 is None:
        return jsonify({"error": "Please provide 'a', 'b', 'p', 'x', 'y', 'x_a', 'y_a', 'd', 's1' and 's2' parameters."}), 400
    
    if not isprime(p):
        return jsonify({"error": "p must be a prime number."}), 400
    
    if not (4 * a**3 + 27 * b**2) % p:
        return jsonify({"error": "The curve is not valid."}), 400
    
    if y**2 % p != (x**3 + a * x + b) % p:
        return jsonify({"error": "The point is not on the curve."}), 400
    if y_a**2 % p != (x_a**3 + a * x_a + b) % p:
        return jsonify({"error": "The point is not on the curve."}), 400

    v1 = (d * pow(s2, -1, r)) % r
    v2 = (s1 * pow(s2, -1, r)) % r
    new_point1 = multiply_elliptic_curve(v1, (x, y), a, b, p)
    new_point2 = multiply_elliptic_curve(v2, (x_a, y_a), a, b, p)
    check_x = add_elliptic_curve(new_point1, new_point2, a, b, p)[0]
    if check_x % r == s1 % r:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 200

