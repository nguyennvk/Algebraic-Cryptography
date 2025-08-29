from flask import request, jsonify, Blueprint
from sympy import factorint

rsa_crack = Blueprint('rsa_crack', __name__)

@rsa_crack.route('/rsa_crack', methods=['GET'])
def get_rsa_crack():
    """
    Calculate the prime factors of a given integer n.
    """
    n = request.args.get('n', type=int)
    if n is None:
        return jsonify({"error": "Please provide 'n' as a query parameter."}), 400
    if n <= 0:
        return jsonify({"error": "Please provide a positive integer for 'n'."}), 400
    factors = factorint(n)
    if not factors:
        return jsonify({"error": "No prime factors found."}), 400
    return jsonify({"factors": factors}), 200