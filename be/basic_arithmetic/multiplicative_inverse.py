from flask import request, jsonify, Blueprint
from basic_arithmetic.bezout import bezout_coefficients
from math import gcd

mul_inverse = Blueprint('mul_inverse', __name__)

@mul_inverse.route('/mul_inverse', methods=['GET'])
def get_mul_inverse():
    """
    Calculate the multiplicative inverse of two integers 'a' and 'b' using the Extended Euclidean algorithm.
    The function takes two integers 'a' and 'p' as query parameters and returns the multiplicative inverse along with the steps taken to compute it.
    Returns an error message if 'a' and 'p' are not coprime or if any of the parameters are missing.
    """
    a = request.args.get('a', type=int)
    p = request.args.get('p', type=int)
    if a is None or p is None:
        return jsonify({"error": "Please provide both 'a' and 'p' as query parameters."}), 400
    if gcd(a, p) != 1:
        return jsonify({"error": "The numbers 'a' and 'p' must be coprime."}), 400
    
    refine_result = bezout_coefficients(a, p)
    inverse = refine_result["refined"][1][a]
    refine_result["inverse"] = inverse%p
    return jsonify(refine_result), 200
    

