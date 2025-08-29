from flask import request, jsonify, Blueprint
from math import gcd

fast_power = Blueprint('fast_power', __name__)

@fast_power.route('/fast_power', methods=['GET'])
def get_mul_inverse():
    """
    Fast Powering Algorithm
    This function calculates the modular exponentiation of a number using the fast powering algorithm.
    It takes three query parameters 'a', 'n', and 'p', where 'a' is the base and 'n' is the exponent and 'p' is .
    It returns the result of a^n mod p.
    """
    a = request.args.get('a', type=int)
    n = request.args.get('n', type=int)
    p = request.args.get('p', type=int)
    if a is None or n is None or p is None:
        return jsonify({"error": "Please provide 'a', 'n', and 'p' as query parameters."}), 400
    return jsonify({"result": pow(a, n, p)})    

